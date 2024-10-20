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
  risqueFormEdit!: UntypedFormGroup;
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
  editRisqueId:any;
  
  @ViewChild('addReview', { static: false }) addReview?: ModalDirective;
  @ViewChild('addVulnerabiliteModal', { static: false }) addVulnerabiliteModal?: ModalDirective;
  @ViewChild('addMenaceModal', { static: false }) addMenaceModal?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  @ViewChild('editRisqueModal', { static: false }) editRisqueModal?: ModalDirective;
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

    this.risqueFormEdit = this.formBuilder.group({
      nom: ['', [Validators.required]],
      valeurFinanciere: ["", [Validators.required]],
      probabilite: ["", [Validators.required, Validators.min(1), Validators.max(6)]],
      priorite: ["", [Validators.required]],
      valeurBaseImpact: ["", [Validators.required, Validators.min(1), Validators.max(6)]],
    });

    // Fetch Data
    this.reviewData = reviews.reverse();
  }

  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  changeTab(tab: string) {
    this.currentTab = tab;
  }

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
        this.removeVulnerabiliteModal?.hide();
        this.toastr.success('Vulnérabilité supprimée avec succès', 'Succès'); 
        this.loadVulnerabilites();
       
    
      },
      error => {
        console.error('Erreur lors de la suppression de la vulnérabilité', error);
        this.toastr.error('Erreur lors de la suppression, veuillez réessayer', 'Erreur'); 
      }
    );
  }

  DeleteMenace() {
    this.vulnerabiliteService.removeMenaceFromVulnerabilite(this.vulnerabiliteId, this.menaceId).subscribe(
      response => {
        console.log('Menace supprimée avec succès', response);
        this.removeItemModal?.hide();
        this.toastr.success('Menace supprimée avec succès', 'Succès'); 
        this.loadVulnerabilites();
      },
      error => {
        console.error('Erreur lors de la suppression de la menace', error);
        this.toastr.error('Erreur lors de la suppression, veuillez réessayer', 'Erreur'); 
      }
    );
  }

  
  editRisqueModalHide(){
    this.editRisqueModal?.hide();
    this.risqueFormEdit.reset();
  
  }

  editRisque(id: any) {
    this.risqueService.getRisqueById(id).subscribe((risque: any) => {
      this.editRisqueId = id;
      console.log(risque)
      this.risqueFormEdit.patchValue({
        nom: risque.nom,
        valeurFinanciere: risque.valeurFinanciere,
        probabilite: risque.probabilite,
        priorite: risque.priorite,
        valeurBaseImpact: risque.valeurBaseImpact,
      });
    
      this.editRisqueModal?.show();
    });
}

updateRisque() {
    this.submitted = true;
    if (this.risqueFormEdit.valid) {
      const updateData = new FormData();
      updateData.append('risqueNom', this.risqueFormEdit.value.nom);
      updateData.append('risqueValeurFinanciere', this.risqueFormEdit.value.valeurFinanciere);
      updateData.append('probabilite', this.risqueFormEdit.value.probabilite);
      updateData.append('risquePriorite', this.risqueFormEdit.value.priorite);
      updateData.append('valeurBaseImpact', this.risqueFormEdit.value.valeurBaseImpact);
      this.risqueService.editRisque(this.editRisqueId, updateData).subscribe(
        response => {
          this.toastr.success('risque mis à jour avec succès !', 'Succès');  
          console.log('risque updated successfully:', response);
          this.loadRisque();
         this.editRisqueModalHide();
        },
        error => {
          this.toastr.error('Erreur lors de la mise à jour de risque.', 'Erreur'); 
          console.error('Error updating risque:', error);
        }
      );
    }
}
}
