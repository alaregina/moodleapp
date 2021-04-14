// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component, ViewChild } from '@angular/core';
import { CoreCourseProvider } from '@core/course/providers/course';
import { CoreCourseHelperProvider } from '@core/course/providers/helper';
import { IonicPage, NavParams } from 'ionic-angular';
import { CoreSitePluginsModuleIndexComponent } from '../../components/module-index/module-index';

/**
 * Page to render the index page of a module site plugin.
 */
@IonicPage({ segment: 'core-site-plugins-module-index-page' })
@Component({
    selector: 'page-core-site-plugins-module-index',
    templateUrl: 'module-index.html',
})
export class CoreSitePluginsModuleIndexPage {
    @ViewChild(CoreSitePluginsModuleIndexComponent) content: CoreSitePluginsModuleIndexComponent;

    title: string; // Page title.

    module: any;
    courseId: number;
    section: any;
    loaded: boolean = false;
    related: any = [];

    constructor(params: NavParams, private courseProvider: CoreCourseProvider, private courseHelper:CoreCourseHelperProvider) {
        this.title = params.get('title');
        this.module = params.get('module');
        this.courseId = params.get('courseId');
    }

    /**
     * Refresh the data.
     *
     * @param refresher Refresher.
     */
    refreshData(refresher: any): void {
        this.content.doRefresh().finally(() => {
            refresher.complete();
        });
    }

    /**
     * The page is about to enter and become the active page.
     */
    ionViewWillEnter(): void {
        this.content.callComponentFunction('ionViewWillEnter');
    }

    /**
     * The page has fully entered and is now the active page. This event will fire, whether it was the first load or a cached page.
     */
    ionViewDidEnter(): void {
        this.content.callComponentFunction('ionViewDidEnter');
        this.courseProvider.getSections(this.courseId, false, true).then((sections) => {
            let section = sections.find(x => (x.modules as any[]).findIndex(i => i.id == this.module.id) >= 0)
            this.courseHelper.addHandlerDataForModules([section], this.courseId, undefined, undefined, true);
            this.section = section;
            this.loaded = true;
            section.modules.forEach(module => {
                if (module.id !== this.module.id) {
                    this.courseProvider.getModuleContentCategory(module.id).then(metadata => {
                        if (!!metadata && metadata["local_metadata_field_section"] && metadata["local_metadata_field_section"] == this.module.category) {
                            module["category"] = metadata["local_metadata_field_section"]
                            this.related.push(module)
                        }
                    })
                }
            });
        })
    }

    /**
     * The page is about to leave and no longer be the active page.
     */
    ionViewWillLeave(): void {
        this.content.callComponentFunction('ionViewWillLeave');
    }

    /**
     * The page has finished leaving and is no longer the active page.
     */
    ionViewDidLeave(): void {
        this.content.callComponentFunction('ionViewDidLeave');
    }

    /**
     * The page is about to be destroyed and have its elements removed.
     */
    ionViewWillUnload(): void {
        this.content.callComponentFunction('ionViewWillUnload');
    }

    /**
     * Check if we can leave the page or not.
     *
     * @return Resolved if we can leave it, rejected if not.
     */
    ionViewCanLeave(): boolean | Promise<void> {
        return this.content.callComponentFunction('ionViewCanLeave');
    }
}
