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
  selectedCategory= null;
  modal: Modal;
  badges: any[];
  points: number = 0;
  macrocategories: any[];
  selectedMacrocategory;
  allCategories: any[];


  constructor(private navCtrl: NavController, 
    private domUtils: CoreDomUtilsProvider, 
    private utils: CoreUtilsProvider, 
    private sitesProvider: CoreSitesProvider,
    private userProvider: CoreUserProvider,
    private coursesProvider:CoreCoursesProvider,
    private modalController: ModalController,
    private badgesProvider: AddonBadgesProvider,
    private gradesProvider: CoreGradesProvider) {
    
  }
  ngAfterViewInit(): void {
    this.fetchUser().finally(()=>{
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
  }
  protected fetchUser(): Promise<any> {
    var userId = this.sitesProvider.getCurrentSite().getUserId();
    return this.userProvider.getProfile(userId).then((user)=>{
      this.user = user;
    })
  }

  /**
     * Fetch the categories.
     *
     * @return Promise resolved when done.
     */
    protected fetchCategories(): Promise<any> {
      return this.coursesProvider.getCategories(0, true).then((cats) => {
          this.currentCategory = undefined;
          cats.sort((a, b) => {
              if (a.depth == b.depth) {
                  return (a.sortorder > b.sortorder) ? 1 : ((b.sortorder > a.sortorder) ? -1 : 0);
              }

              return a.depth > b.depth ? 1 : -1;
          });
          this.macrocategories = cats.filter(x=>x.depth==3 && cats.filter(y=>y.parent==x.id).length>0)
          this.allCategories = cats
          if(this.macrocategories.length==0)
            this.categories = cats.filter(x=>x.depth==3)
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

      Promise.all(promises).finally(() => {
          this.fetchCategories().finally(() => {
              refresher.complete();
          });
      });
  }
  
  selectMacroCategory(macrocategory){
    if (this.selectedMacrocategory == macrocategory)
    {
      this.selectedMacrocategory = -1;
      this.selectedCategory = -1;
      this.categories = null
    } else {
      this.selectedMacrocategory = macrocategory;
      this.selectedCategory = null;
      this.categories = this.allCategories.filter(x=>x.parent==macrocategory)
    }
  }
  /**
   * Open a category.
   *
   * @param categoryId The category ID.
   */
  openCategory(category) {
    if (this.selectedCategory && this.selectedCategory.id == category.id)
    {
      this.selectedCategory = null;
    } else {
      this.selectedCategory = category;
    }
  }

  dismiss($event){
    this.selectedCategory = null;
  }

  loadBadges(){
    return this.badgesProvider.getUserBadges(null, this.user.id).then((badges:any[])=>{
      this.badges = badges.filter(badge=>badge.courseid==null).sort((a,b)=>a.dateissued-b.dateissued);
    })
  }

  loadPoints(){
    this.points = 0;
    return this.gradesProvider.getCoursesGrades().then((grades:any[])=>{
        grades.forEach(grade=>{
          this.points += +(grade.grade as string).replace("-", "0").replace(",", ".")
        })
        this.points = Math.round(this.points)
    })
  }
}
