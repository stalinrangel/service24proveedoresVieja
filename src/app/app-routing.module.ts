import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../core/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },	
  { path: 'login', loadChildren: './login/login.module#LoginPageModule', canActivate: [AuthGuardService]},
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'confirm-info', loadChildren: './confirm-info/confirm-info.module#ConfirmInfoPageModule' },
  { path: 'privacy-policy', loadChildren: './privacy-policy/privacy-policy.module#PrivacyPolicyPageModule' },
  { path: 'terms-conditions', loadChildren: './terms-conditions/terms-conditions.module#TermsConditionsPageModule' },
  { path: 'calification', loadChildren: './calification/calification.module#CalificationPageModule' },
  { path: 'complete-register', loadChildren: './complete-register/complete-register.module#CompleteRegisterPageModule' },
  { path: 'contract', loadChildren: './contract/contract.module#ContractPageModule' },
  { path: 'signature', loadChildren: './signature/signature.module#SignaturePageModule' },
  { path: 'add-service-pre', loadChildren: './add-service-pre/add-service-pre.module#AddServicePrePageModule' },
  { path: 'codepassword', loadChildren: './codepassword/codepassword.module#CodepasswordPageModule' },
  { path: 'email-password', loadChildren: './email-password/email-password.module#EmailPasswordPageModule' },
  { path: 'contrasena', loadChildren: './contrasena/contrasena.module#ContrasenaPageModule' },
  { path: 'chat-support', loadChildren: './chat-support/chat-support.module#ChatSupportPageModule' },
  { path: 'cancel-order', loadChildren: './cancel-order/cancel-order.module#CancelOrderPageModule' },
  { path: 'chat-pedidos', loadChildren: './chat-pedidos/chat-pedidos.module#ChatPedidosPageModule' },
  { path: 'detail-order', loadChildren: './detail-order/detail-order.module#DetailOrderPageModule' },
  { path: 'detail-tracking', loadChildren: './detail-tracking/detail-tracking.module#DetailTrackingPageModule' },
  { path: 'list-services',loadChildren: './list-services/list-services.module#ListServicesPageModule' },
  { path: 'add-service', loadChildren: './add-service/add-service.module#AddServicePageModule' },
  { path: 'edit-profile', loadChildren: './edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'change-password', loadChildren: './change-password/change-password.module#ChangePasswordPageModule' },
  { path: 'privacy-policy', loadChildren: './privacy-policy/privacy-policy.module#PrivacyPolicyPageModule' },
  { path: 'terms-conditions', loadChildren: './terms-conditions/terms-conditions.module#TermsConditionsPageModule' },
  { path: 'edit-service', loadChildren: './edit-service/edit-service.module#EditServicePageModule' },
  { path: 'tutorial', loadChildren: './tutorial/tutorial.module#TutorialPageModule' },
  { path: 'view-contrat', loadChildren: './view-contrat/view-contrat.module#ViewContratPageModule' },
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'zones-register', loadChildren: './zones-register/zones-register.module#ZonesRegisterPageModule' },
  { path: 'zones', loadChildren: './zones/zones.module#ZonesPageModule' },
  { path: 'payments', loadChildren: './payments/payments.module#PaymentsPageModule' },
  { path: 'zones-service', loadChildren: './zones-service/zones-service.module#ZonesServicePageModule' },
  { path: 'camera-preview', loadChildren: './camera-preview/camera-preview.module#CameraPreviewPageModule' },
  { path: 'verify-number', loadChildren: './verify-number/verify-number.module#VerifyNumberPageModule' },
  { path: 'finish-register', loadChildren: './finish-register/finish-register.module#FinishRegisterPageModule' },
  { path: 'info-profile', loadChildren: './info-profile/info-profile.module#InfoProfilePageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
