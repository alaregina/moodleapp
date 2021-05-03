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
    // this.categories.push({name: "Artic"})
    // this.categories.push({name: "Assenzio"})
    // this.categories.push({name: "Malibu"})
    // this.categories.push({name: "Skyy"})
    // this.categories.push({name: "Beer"})
    // this.categories.push({name: "GinMare"})
    // this.categories.push({name: "Jägermeister"})
    // this.categories.push({name: "Calua"})
    // this.categories.push({name: "Cognac"})
    // this.categories.push({name: "Estrella"})
    // this.categories.push({name: "Gin"})
    // this.categories.push({name: "Johnny Walker"})
    // this.categories.push({name: "Absolut"})
    // this.categories.push({name: "Jim Beam"})
    // this.categories.push({name: "JackDaniels"})
    // this.categories.push({name: "Campari"})
    // this.categories.push({name: "Cynar"})
    // this.categories.push({name: "Jim Beam"})
    this.categories = this.categories.sort((a:any,b:any)=>a.name>b.name ? 1:-1)
  }

  ionViewDidLoad() {
  }
  goToCourse(item){
    this.navCtrl.push('CoursePage', {category: item})
  }
}
