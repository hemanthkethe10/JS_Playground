function(input){
    $(document).ready(function() {
       if(input.pageData.isUploadedSSHKeyTest === true){
          $('[sshKeyTestUpload]').children().eq(0).css('opacity', 0.5);
  //         $('[sshKeyTestDelete]').children().eq(0).css('opacity', 0.5);
  //  $('[sshKeyTestDelete]').children().eq(0).css('pointer-events', 'none');
       }
       if(input.pageData.isUploadedPGPKeyTest === true){
          $('[pgpKeyTestUpload]').children().eq(0).css('opacity', 0.5);
  //         $('[pgpKeyTestDelete]').children().eq(0).css('opacity', 0.5);
  //  $('[pgpKeyTestDelete]').children().eq(0).css('pointer-events', 'none');
       }
       if(input.pageData.isUploadedFileAttachment === true){
          $('[fileAttachmentUpload]').children().eq(0).css('opacity', 0.5);
          $('[fileAttachmentDelete]').children().eq(0).css('opacity', 0.5);
  $('[fileAttachmentDelete]').children().eq(0).css('pointer-events', 'none');
       }
       if(input.pageData.isUploadedSSHKeyProd === true){
          $('[sshKeyProdUpload]').children().eq(0).css('opacity', 0.5);
       }
       if(input.pageData.isUploadedPGPKeyProd === true){
          $('[pgpKeyProdUpload]').children().eq(0).css('opacity', 0.5);
       }
    });}