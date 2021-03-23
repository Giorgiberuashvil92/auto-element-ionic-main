import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {NgxMaskModule} from 'ngx-mask';
import {TranslateModule} from '@ngx-translate/core';

import {OffersComponent} from './components/offers/offers.component';

import {FileSelectComponent} from './components/file-select/file-select.component';
import {FileUploaderComponent} from './components/file-uploader/file-uploader.component';
import {ImagesUploadComponent} from './components/images-upload/images-upload.component';
import {ImagesSliderComponent} from './components/images-slider/images-slider.component';
import {ImageModalViewComponent} from './components/image-modal-view/image-modal-view.component';
import {SellersComponent} from './components/sellers/sellers.component';
import {SortRatingPipe} from './components/sort-rating.pipe';
import {SortVipPipe} from './components/sort-vip.pipe';

const components = [
    OffersComponent,
    SellersComponent,
    FileSelectComponent,
    FileUploaderComponent,
    ImagesUploadComponent,
    ImagesSliderComponent,
    ImageModalViewComponent,
    SortRatingPipe,
    SortVipPipe
];

@NgModule({
    declarations: [components],
    imports: [
        TranslateModule.forChild(),
        CommonModule,
        NgxMaskModule.forRoot(),
        IonicModule,
        FormsModule,
        RouterModule
    ],
    exports: [
        TranslateModule,
        NgxMaskModule,
        components
    ],
    entryComponents: [
        ImageModalViewComponent,
    ],
})
export class CoreModule {
}
