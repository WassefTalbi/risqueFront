import { Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { reviews } from './data';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { RisqueService } from 'src/app/core/services/risque.service';
import { ActivatedRoute } from '@angular/router';
import { VulnerabiliteService } from 'src/app/core/services/vulnerabilite.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-risque',
  templateUrl: './risque.component.html',
  styleUrls: ['./risque.component.scss'] 
})
export class RisqueComponent {

  // Bread crumb items
  breadCrumbItems!: Array<{}>;
  vulnerabiliteForm!: UntypedFormGroup;
  menaceForm!: UntypedFormGroup;
  reviewData: any;
  submitted: boolean = false;
  currentTab = 'description';
  addVulnerabiliteError: string | null = null;
  addMenaceError: string | null = null;
  currentActifId!: string | null;
  vulnerabiliteId!: string | null;
  menaceId!: string | null;
  checkedVulnerabiliteId!: string;
  risque: any;
  actif: any;
  vulnerabilites!: any[];
  
  @ViewChild('addReview', { static: false }) addReview?: ModalDirective;
  @ViewChild('addVulnerabiliteModal', { static: false }) addVulnerabiliteModal?: ModalDirective;
  @ViewChild('addMenaceModal', { static: false }) addMenaceModal?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  @ViewChild('removeVulnerabiliteModal', { static: false }) removeVulnerabiliteModal?: ModalDirective;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private risqueService: RisqueService,
    private vulnerabiliteService: VulnerabiliteService,
    private route: ActivatedRoute,
    private toastr: ToastrService 
  ) { }

  ngOnInit(): void {
    // Breadcrumb
    this.breadCrumbItems = [
      { label: 'Actif', active: true },
      { label: 'Risque', active: true }
    ];

    this.getCurrentActifId();
    this.loadRisque();
    this.loadVulnerabilites();

    // Form Validation
    this.vulnerabiliteForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      actifId: [this.currentActifId, [Validators.required]],
    });

    this.menaceForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
    });

    // Fetch Data
    this.reviewData = reviews.reverse();
  }

  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  // Change Tab Content
  changeTab(tab: string) {
    this.currentTab = tab;
  }

  // Open & close chatbox
  openchatbox() {
    document.getElementById('emailchat-detailElem')?.classList.add('d-block');
  }
  
  closechatbox() {
    document.getElementById('emailchat-detailElem')?.classList.remove('d-block');
  }

  getCurrentActifId() {
    this.route.paramMap.subscribe(params => {
      this.currentActifId = params.get('id');
      console.log(this.currentActifId);
    });
  }

  loadRisque() {
    this.risqueService.getActifById(this.currentActifId).subscribe((data) => {
      this.actif = data;
      this.risque = data.risque;
      console.log('risque of actif', data.risque);
    });
  }

  loadVulnerabilites() {
    this.vulnerabiliteService.getVulnerabiliteByActif(this.currentActifId).subscribe((data) => {
      this.vulnerabilites = data;
      console.log('vulnerabilites of actif', data);
    });
  }

  checkVulnerabilite(idVulnerabilite: any) {
    this.checkedVulnerabiliteId = idVulnerabilite;
    console.log(idVulnerabilite);
    this.addMenaceModal?.show();
  }

  saveVulnerabilite() {
    if (this.vulnerabiliteForm.valid) {
      const registerData = new FormData();
      registerData.append('nom', this.vulnerabiliteForm.value.nom);
      registerData.append('actifId', this.vulnerabiliteForm.value.actifId);

      this.vulnerabiliteService.addVulnerabilite(registerData).subscribe(
        response => {
          this.vulnerabiliteForm.reset();
          this.loadVulnerabilites();
          this.addVulnerabiliteModal?.hide();
          this.toastr.success('Vulnérabilité ajoutée avec succès', 'Succès'); 
        },
        error => {
          if (error.status === 400) {
            let errorMessage = '';
            for (const field in error.error) {
              if (error.error.hasOwnProperty(field)) {
                errorMessage += `./ ${error.error[field]} <br>`;
              }
            }
            this.addVulnerabiliteError = errorMessage.trim();
          } else if (error.status === 409) {
            this.addVulnerabiliteError = error.error;
          } else {
            this.addVulnerabiliteError = 'Une erreur inattendue est survenue pendant l\'inscription, essayez encore';
          }
          this.toastr.error(this.addVulnerabiliteError || 'Erreur, veuillez réessayer', 'Erreur'); 
        }
      );
    }
  }

  saveMenace() {
    if (this.menaceForm.valid) {
      const registerData = new FormData();
      registerData.append('nom', this.menaceForm.value.nom);
      registerData.append('vulnerabiliteId', this.checkedVulnerabiliteId);

      this.vulnerabiliteService.addMenace(registerData).subscribe(
        response => {
          this.menaceForm.reset();
          this.loadVulnerabilites();
          this.addMenaceModal?.hide();
          this.toastr.success('Menace ajoutée avec succès', 'Succès');
        },
        error => {
          if (error.status === 400) {
            let errorMessage = '';
            for (const field in error.error) {
              if (error.error.hasOwnProperty(field)) {
                errorMessage += `./ ${error.error[field]} <br>`;
              }
            }
            this.addMenaceError = errorMessage.trim();
          } else if (error.status === 409) {
            this.addMenaceError = error.error;
          } else {
            this.addMenaceError = 'Une erreur inattendue est survenue pendant l\'inscription, essayez encore';
          }
          this.toastr.error(this.addMenaceError || 'Erreur, veuillez réessayer', 'Erreur');
        }
      );
    }
  }

  removeReview(idVul: any, idMenace: any) {
    console.log("display the id of vulnerabilite and the id of menace" + idVul, idMenace);
     this.vulnerabiliteId = idVul
     this.menaceId = idMenace
     this.removeItemModal?.show()
  }

  removeVulnerabilite(idVulnerabilite: any) {
    console.log("display the id of vulnerabilite and the id of menace" + idVulnerabilite);
    this.vulnerabiliteId = idVulnerabilite;
    this.removeVulnerabiliteModal?.show();
  }

  DeleteVulnerabilite() {
    this.vulnerabiliteService.removeVulnerabiliteFromActif(this.currentActifId, this.vulnerabiliteId).subscribe(
      response => {
        console.log('Vulnérabilité supprimée avec succès', response);
        this.loadVulnerabilites();
        this.removeItemModal?.hide();
        this.toastr.success('Vulnérabilité supprimée avec succès', 'Succès'); // Success toast
      },
      error => {
        console.error('Erreur lors de la suppression de la vulnérabilité', error);
        this.toastr.error('Erreur lors de la suppression, veuillez réessayer', 'Erreur'); // Error toast
      }
    );
  }

  DeleteMenace() {
    this.vulnerabiliteService.removeMenaceFromVulnerabilite(this.vulnerabiliteId, this.menaceId).subscribe(
      response => {
        console.log('Menace supprimée avec succès', response);
        this.loadVulnerabilites();
        this.removeItemModal?.hide();
        this.toastr.success('Menace supprimée avec succès', 'Succès'); // Success toast
      },
      error => {
        console.error('Erreur lors de la suppression de la menace', error);
        this.toastr.error('Erreur lors de la suppression, veuillez réessayer', 'Erreur'); // Error toast
      }
    );
  }
}
