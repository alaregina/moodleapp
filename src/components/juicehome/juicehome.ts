import { AddonBadgesProvider } from '@addon/badges/providers/badges';
import { AfterViewInit, Component } from '@angular/core';
import { CoreCourseHelperProvider } from '@core/course/providers/helper';
import { CoreCoursesProvider } from '@core/courses/providers/courses';
import { CoreCoursesHelperProvider } from '@core/courses/providers/helper';
import { CoreGradesProvider } from '@core/grades/providers/grades';
import { CoreUserProvider } from '@core/user/providers/user';
import { CoreSitesProvider } from '@providers/sites';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { Modal, ModalController, NavController } from 'ionic-angular';
import { CoursesModalPage } from '../../pages/courses-modal/courses-modal';
/**
 * Generated class for the JuicehomeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'juicehome',
  templateUrl: 'juicehome.html'
})
export class JuicehomeComponent implements AfterViewInit {

  text: string;
  categories: any[] = [];
  currentCategory: any;
  categoryId: number;
  title: any;
  courses: any[];
  categoriesLoaded: boolean = false;
  userLoaded: boolean = false;
  user: any = {};
  selectedCategory = null;
  modal: Modal;
  badgeReady: boolean = false;
  points: number = 0;
  macrocategories: any[];
  selectedMacrocategory;
  allCategories: any[];
  badgeAlcolizzato: boolean;
  badgeSommelier: boolean;
  badgeMegadirettore: boolean;
  badge: string = null
  coursesCategory: any[]
  constructor(private navCtrl: NavController,
    private domUtils: CoreDomUtilsProvider,
    private utils: CoreUtilsProvider,
    private sitesProvider: CoreSitesProvider,
    private userProvider: CoreUserProvider,
    private coursesProvider: CoreCoursesProvider,
    private modalController: ModalController,
    private badgesProvider: AddonBadgesProvider,
    private gradesProvider: CoreGradesProvider,
    private coursesHelper: CoreCoursesHelperProvider) {

  }
  ngAfterViewInit(): void {
    this.fetchUser().finally(() => {
      const promises = [];
      promises.push(this.loadBadges())
      promises.push(this.loadPoints())
      Promise.all(promises).finally(() => {
        this.userLoaded = true;
      })
    });
    this.fetchCategories().finally(() => {
      this.categoriesLoaded = true;
    });
    this.fetchCourses()
  }
  protected fetchUser(): Promise<any> {
    var userId = this.sitesProvider.getCurrentSite().getUserId();
    return this.userProvider.getProfile(userId).then((user) => {
      this.user = user;
    })
  }

  /**
     * Fetch the categories.
     *
     * @return Promise resolved when done.
     */
  protected fetchCategories(): Promise<any> {
    //passando 0 e true vengono prese TUTTE le categorie. Diventa pesante se aumentano i corsi.
    //L'alternativa è costruire l'albero fino al 3°/4° livello e poi costruire il resto on demand
    return this.coursesProvider.getCategories(0, true).then((cats) => {
      this.currentCategory = undefined;
      cats.sort((a, b) => {
        if (a.depth == b.depth) {
          return (a.sortorder > b.sortorder) ? 1 : ((b.sortorder > a.sortorder) ? -1 : 0);
        }

        return a.depth > b.depth ? 1 : -1;
      });
      this.macrocategories = []
      if (cats.sort((a, b) => b.depth - a.depth)[0].depth >= 5)//le macrocategorie possono esserci o non esserci, per capirlo al momento usiamo la profondità massima
        this.macrocategories = cats.filter(x => x.depth == 3 && cats.filter(y => y.parent == x.id).length > 0)
      this.allCategories = cats
      if (this.macrocategories.length == 0)
        this.categories = cats.filter(x => x.depth == 3)
    }).catch((error) => {
      this.domUtils.showErrorModalDefault(error, 'core.courses.errorloadcategories', true);
    });
  }

  /**
     * Refresh the categories.
     *
     * @param refresher Refresher.
     */
  refreshCategories(refresher: any): void {
    const promises = [];

    promises.push(this.coursesProvider.invalidateUserCourses());
    promises.push(this.coursesProvider.invalidateCategories(this.categoryId, true));
    promises.push(this.coursesProvider.invalidateCoursesByField('category', this.categoryId));
    promises.push(this.sitesProvider.getCurrentSite().invalidateConfig());
    promises.push(this.loadBadges())
    promises.push(this.loadPoints())
    this.fetchCourses()
    Promise.all(promises).finally(() => {
      this.fetchCategories().finally(() => {
        refresher.complete();
      });
    });
  }

  /**
       * Fetch the user courses.
       *
       * @return Promise resolved when done.
       */
  protected fetchCourses(): Promise<any> {
    return this.coursesProvider.getUserCourses().then((courses) => {
      const promises = [],
        courseIds = courses.map((course) => {
          return course.id;
        });
      var attestati = {}
      var attestatiProm = [];
      courses.forEach(x => {
        attestatiProm.push(new Promise((resolve, reject) => {
          if (!attestati[x.category])
            attestati[x.category] = { badges: 0 }
          this.loadCoursesBadges(x.id).then(badgeCount => {
            attestati[x.category].badges += badgeCount
            if (!attestati[x.category].category)
              this.coursesProvider.getCategories(x.category).then(c => {
                attestati[x.category].category = c[0].name
                resolve(attestati)
              })
            else
              resolve(attestati)
          })
        }))
      })
      Promise.all(attestatiProm).then(() => {
        var att = Object.values<any>(attestati);
        let spiritsBadges = att.find(x => x.category == "Spirits") ? att.find(x => x.category == "Spirits").badges : 0
        let wineBadges = att.find(x => x.category == "Wine") ? att.find(x => x.category == "Wine").badges : 0
        this.badgeAlcolizzato = spiritsBadges >= 3
        this.badgeSommelier = wineBadges >= 3
        this.badgeMegadirettore = this.badgeAlcolizzato && this.badgeSommelier
        this.badge = this.badgeMegadirettore ? 'assets/img/megadirettore.png' : this.badgeSommelier ? 'assets/img/sommelier.png' : this.badgeAlcolizzato ? 'assets/img/alcolizzato.png' : null
        this.badgeReady = true
      })

      promises.push(this.coursesHelper.loadCoursesExtraInfo(courses));

      if (this.coursesProvider.canGetAdminAndNavOptions()) {
        promises.push(this.coursesProvider.getCoursesAdminAndNavOptions(courseIds).then((options) => {
          courses.forEach((course) => {
            course.navOptions = options.navOptions[course.id];
            course.admOptions = options.admOptions[course.id];
          });
        }));
      }
      promises.push(courses.forEach(course => {
        console.log("🚀 ~ file: juicehome.ts ~ line 180 ~ JuicehomeComponent ~ returnthis.coursesProvider.getUserCourses ~ course", course)
        this.coursesProvider.getCourseByField('id', course.id).then((c) => {
          let hightlight = (c.customfields as any[]).find(x => x.shortname == "highlight")
          course.highlight = !!hightlight ? (+hightlight.valueraw) : false
          let percorso_tematico = (c.customfields as any[]).find(x => x.shortname == "percorso_tematico")
          course.thematicRoutes = !!percorso_tematico ? (+percorso_tematico.valueraw) : false
        });
      }))
      return Promise.all(promises).then(() => {
        this.courses = courses;
        //this.initPrefetchCoursesIcon();
      });
    }).catch((error) => {
      this.domUtils.showErrorModalDefault(error, 'core.courses.errorloadcourses', true);
    });
  }

  highlighted(courses) {
    return courses.filter(c => c.highlight)
  }

  resume(courses) {
    return courses.filter(c => c.lastaccess != null && (c.completed == false || c.progress < 100))
  }

  selectMacroCategory(macrocategory) {
    if (this.selectedMacrocategory == macrocategory) {
      this.selectedMacrocategory = null;
      this.selectedCategory = null;
      this.categories = null
    } else {
      this.selectedMacrocategory = macrocategory;
      this.selectedCategory = null;
      this.categories = this.allCategories.filter(x => x.parent == macrocategory)
      if (this.categories.length == 1)
        this.openCategory(this.categories[0])
    }
  }
  /**
   * Open a category.
   *
   * @param categoryId The category ID.
   */
  openCategory(category) {
    if (this.selectedCategory && this.selectedCategory.id == category.id) {
      this.selectedCategory = null;
    } else {
      this.selectedCategory = category;
      this.coursesCategory = this.allCategories.filter(x => x.parent == category.id)
    }
  }

  dismiss($event) {
    this.selectedCategory = null;
  }

  loadBadges() {
    return this.badgesProvider.getUserBadges(null, this.user.id).then((badges: any[]) => {
      //this.badges = badges.filter(badge=>badge.courseid==null).sort((a,b)=>a.dateissued-b.dateissued);
    })
  }

  loadPoints() {
    this.points = 0;
    return this.gradesProvider.getCoursesGrades().then((grades: any[]) => {
      grades.forEach(grade => {
        this.points += +(grade.grade as string).replace("-", "0").replace(",", ".")
      })
      this.points = Math.round(this.points)
    })
  }
  loadCoursesBadges(courseId) {
    var d = new Date();
    d.setDate(d.getDate() - 7);
    return new Promise((resolve, reject) => {
      this.badgesProvider.getUserBadges(courseId, this.user.id).then((badges: any[]) => {
        var badgesCount = badges.filter(badge => new Date(badge.dateissued * 1000).getTime() > d.getTime()).length
        resolve(badgesCount)
      })
    })
  }

  getCount(category) {
    return this.allCategories.filter(c => c.parent == category.id).length;
  }

  goToDocentiPage() {
    console.log('go to docenti page click');
    this.navCtrl.push('TeachersPage');
  }
}
