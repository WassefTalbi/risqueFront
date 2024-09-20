import {Component, ViewChild} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {DropzoneConfigInterface, DropzoneModule} from "ngx-dropzone-wrapper";
import {ModalDirective, ModalModule} from "ngx-bootstrap/modal";
import {NgxSliderModule} from "ngx-slider-v2";
import {PageChangedEvent, PaginationModule} from "ngx-bootstrap/pagination";
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {SharedModule} from "../../../shared/shared.module";
import {SimplebarAngularModule} from "simplebar-angular";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {UiSwitchModule} from "ngx-ui-switch";
import {Options} from "@angular-slider/ngx-slider";
import {Store} from "@ngrx/store";
import {
  addlistingGridData, deletelistingGridData,
  fetchlistingGridData,
  updatelistingGridData
} from "../../../store/App-realestate/apprealestate.action";
import {selectData} from "../../../store/App-realestate/apprealestate-selector";
import {ModelsService} from "../../../core/services/models.service";

@Component({
  selector: 'app-models',
 // standalone: true,
//    imports: [CommonModule, BsDropdownModule, DropzoneModule, ModalModule, NgxSliderModule, PaginationModule, ReactiveFormsModule, RouterLink, SharedModule, SimplebarAngularModule, TooltipModule, UiSwitchModule,],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss',
  providers: [DecimalPipe]
})
export class ModelsComponent {
  models: any[] = [];
  files: File[] = [];
  page: number = 1
  selectedModelsType: string = "Villa"
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  productslist: any
  modelsForm!: UntypedFormGroup;
  submitted = false;
  products: any;
  endItem: any
  // price: any = [500, 3800];

  bedroom: any;

  // Price Slider
  pricevalue: number = 100;
  minValue = 500;
  maxValue = 3800;
  options: Options = {
    floor: 0,
    ceil: 5000,
    translate: (value: number): string => {
      return '$' + value;
    },
  };

  @ViewChild('addModels', { static: false }) addModels?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  deleteID: any;
  editData: any;

  constructor(private formBuilder: UntypedFormBuilder, public store: Store, private modelService: ModelsService) {
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Models', active: true },
      { label: 'STT', active: true }
    ];
    setTimeout(() => {
      this.store.dispatch(fetchlistingGridData());
      this.store.select(selectData).subscribe((data) => {
        this.products = data;
        this.productslist = data;
        this.products = this.productslist.slice(0, 8)
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000);

    /**
     * Form Validation
     */
    this.modelsForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      url: ['', [Validators.required]],
      image: ['', [Validators.required]],
      users: this.formBuilder.array([]) // Initialize as an empty array. You can add form groups to this array as needed.
    });

    this.getModels();

  }

  // Hide/Show Filter
  showFilter() {
    const filterStyle = (document.getElementById("ModelsFilters") as HTMLElement).style.display;
    if (filterStyle == 'none') {
      (document.getElementById("ModelsFilters") as HTMLElement).style.display = 'block'
    } else {
      (document.getElementById("ModelsFilters") as HTMLElement).style.display = 'none'
    }
  }

  // Add to starr
  starredproduct(id: any, event: any, star: any) {
    event.target.classList.toggle('active')
    if (star == false) {
      this.products[id].starred = true
    } else {
      this.products[id].starred = false
    }
  }

  // filter bedroom wise
  bedroomFilter(ev: any) {
    if (ev.target.value != '') {
      if (ev.target.checked == true) {
        this.products = this.productslist.filter((el: any) => {
          return el.bedroom == ev.target.value
        })
      }
    } else {
      this.products = this.productslist
    }
  }

  // filter of bathrom wise
  bathroomFilter(ev: any) {
    if (ev.target.value != '') {
      if (ev.target.checked == true) {
        this.products = this.productslist.filter((el: any) => {
          return el.bedroom == ev.target.value
        })
      }
    } else {
      this.products = this.productslist
    }
  }

  // location wise filter
  location() {
    const location = (document.getElementById("select-location") as HTMLInputElement).value
    if (location) {
      this.products = this.productslist.filter((data: any) => {
        return data.location === location
      })
    } else {
      this.products = this.productslist
    }
    this.updateNoResultDisplay()
  }

  /**
   * Range Slider Wise Data Filter
   */
  valueChange(event: number, isMinValue: boolean) {
    if (isMinValue) {
      this.minValue = event;
    } else {
      this.maxValue = event;
    }

  }

  Models() {
    this.products = this.productslist.filter((data: any) => {
      if (this.selectedModelsType === "") {
        return true
      } else {
        return data.type === this.selectedModelsType
      }
    })
  }

  // Edit Data
  editList(id: any) {
    this.uploadedFiles = [];
    this.addModels?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Product'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    this.editData = this.products[id]
    this.uploadedFiles.push({ 'dataURL': this.editData.img, 'name': this.editData.imgalt, 'size': 1024, });
    this.modelsForm.patchValue(this.products[id]);
  }





  getModels(){
    this.modelService.getAllModels().subscribe(response => {
      this.models = response;
    }, error => {
      console.error(error);
    });
  }

  onSelectFile(file: any, response: any) {
  const reader: FileReader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    let base64: string = reader.result as string;
    // Remove prefix
    base64 = base64.substring(base64.indexOf(',') + 1);
    if (this.modelsForm.get('image')) {
      this.modelsForm.get('image')?.setValue(base64);
      console.log(this.modelsForm.get('image')?.value);
    }
  };
  this.uploadedFiles.push({
    dataURL: file.dataURL,
    name: file.name,
    size: file.size
  });
}
  saveModels() {
  if (this.modelsForm.valid) {
    if (this.modelsForm.get('id')?.value) {
      const updatedData = { ...this.modelsForm.value };
      // Call your update method here
    } else {
      const newData = {
        ...this.modelsForm.value,
      };
      this.modelService.addModelSTT(newData).subscribe(response => {
       this.getModels();
        console.log(response);
      }, error => {

        console.error(error);
      });
    }
    this.modelsForm.reset();
    this.uploadedFiles = [];
    this.addModels?.hide();
  }
}  // Delete Product





  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }

  confirmDelete() {
    this.store.dispatch(deletelistingGridData({ id: this.deleteID.toString()}));
    this.deleteRecordModal?.hide()
  }


  // File Upload
  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  uploadedFiles: any[] = [];

  // File Upload
  imageURL: any;
  onUploadSuccess(event: any) {
    setTimeout(() => {
      this.uploadedFiles.push(event[0]);
      this.modelsForm.controls['img'].setValue(event[0].dataURL);
    }, 0);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // Page Changed
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.products = this.productslist.slice(startItem, endItem);
  }

  // no result
  updateNoResultDisplay() {
    const noResultElement = document.getElementById('noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement;

    if (this.products.length === 0) {
      noResultElement.style.display = 'block';
      paginationElement.classList.add('d-none')
    } else {
      noResultElement.style.display = 'none';
      paginationElement.classList.remove('d-none')
    }
  }
}

