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
import { IonicPage, NavParams } from 'ionic-angular';
import { CoreDomUtils } from '@providers/utils/dom';
import { AddonModH5PActivityIndexComponent } from '../../components/index/index';
import { AddonModH5PActivityData } from '../../providers/h5pactivity';

import { Translate } from '@singletons/core.singletons';
import { CoreCourseProvider } from '@core/course/providers/course';
import { CoreCourseHelperProvider } from '@core/course/providers/helper';
import { CoreCoursesProvider } from '@core/courses/providers/courses';

/**
 * Page that displays an H5P activity.
 */
@IonicPage({ segment: 'addon-mod-h5pactivity-index' })
@Component({
    selector: 'page-addon-mod-h5pactivity-index',
    templateUrl: 'index.html',
})
export class AddonModH5PActivityIndexPage {
    @ViewChild(AddonModH5PActivityIndexComponent) h5pComponent: AddonModH5PActivityIndexComponent;

    title: string;
    module: any;
    courseId: number;
    related: any[] = [];
    section: any;
    downloadEnabled = false
    loaded: boolean;
    course: any;
    constructor(navParams: NavParams, private courseProvider: CoreCourseProvider, private coursesProvider: CoreCoursesProvider, private courseHelper: CoreCourseHelperProvider) {
        this.module = navParams.get('module') || {};
        this.courseId = navParams.get('courseId');
        courseHelper.getCourse(this.courseId).then(course => {
            this.course = course.course;
            this.coursesProvider.getCategories(this.course.category).then(category => {
                this.course["categoryname"] = category[0].name
            })
        })
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
        this.title = this.module.name;
    }

    /**
     * Update some data based on the H5P activity instance.
     *
     * @param h5p H5P activity instance.
     */
    updateData(h5p: AddonModH5PActivityData): void {
        this.title = h5p.name || this.title;
    }

    /**
     * Check if we can leave the page or not.
     *
     * @return Resolved if we can leave it, rejected if not.
     */
    ionViewCanLeave(): Promise<void> {
        if (!this.h5pComponent.playing || this.h5pComponent.isOpeningPage) {
            return;
        }

        return CoreDomUtils.instance.showConfirm(Translate.instance.instant('core.confirmleaveunknownchanges'));
    }

    /**
     * The completion of any of the modules have changed.
     */
    onCompletionChange(completionData: any): void {

    }

    /**
     * Recalculate the download status of each section, in response to a module being downloaded.
     *
     * @param eventData
     */
    onModuleStatusChange(eventData: any): void {

    }
}
