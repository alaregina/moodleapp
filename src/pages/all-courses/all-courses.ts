import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AllCoursesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-courses',
  templateUrl: 'all-courses.html',
})
export class AllCoursesPage {
  categories: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.categories = navParams.get("categories");
    // this.categories.push({ name: "Artic", coursecount: "2" });
    // this.categories.push({ name: "Assenzio", coursecount: "2" });
    // this.categories.push({ name: "Malibu", coursecount: "2" });
    // this.categories.push({ name: "Skyy", coursecount: "2" });
    // this.categories.push({ name: "Beer", coursecount: "2" });
    // this.categories.push({ name: "GinMare", coursecount: "2" });
    // this.categories.push({ name: "Jägermeister", coursecount: "2" });
    // this.categories.push({ name: "Calua", coursecount: "2" });
    // this.categories.push({ name: "Cognac", coursecount: "2" });
    // this.categories.push({ name: "Estrella", coursecount: "2" });
    // this.categories.push({ name: "Gin", coursecount: "2" });
    // this.categories.push({ name: "Johnny Walker", coursecount: "2" });
    // this.categories.push({ name: "Absolut", coursecount: "2" });
    // this.categories.push({ name: "Jim Beam", coursecount: "2" });
    // this.categories.push({ name: "JackDaniels", coursecount: "2" });
    // this.categories.push({ name: "Campari", coursecount: "2" });
    // this.categories.push({ name: "Cynar", coursecount: "2" });
    // this.categories.push({ name: "Jim Beam", coursecount: "2" });
    this.categories = this.categories.sort((a: any, b: any) => a.name > b.name ? 1 : -1);
  }

  ionViewDidLoad() {
  }
  goToCourse(item) {
    this.navCtrl.push('CoursePage', { category: item });
  }
}
