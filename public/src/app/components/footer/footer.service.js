(function() {
  "use strict";
  angular
    .module("IMGDMSAPI")
    .service("footerService", ['$q', footerService]);

  function footerService($q) {
    var address , footerLink, copyright_txt
    address = {
      "title": "Lakeshore RV Center",
      "address_line1": "4500 E. Apple Ave",
      "zip_code": "49442",
      "city": "Muskegon",
      "state": "Michigan",
      "country": "United States (US)",
      "phone": "231-683-4543",
      "secondry_phone": "231-788-2040",
      "fax": "231-788-5205"
    };
    footerLink = [ {
      "name": "Terms of Service Agreement",
      "sref": "tos"
    },
    {
      "name": "Return Policy",
      "sref": "return-policy"
    },
    {
      "name": "Privacy Policy",
      "sref": "privacy-policy"
    },
    {
      "name": "Sitemap – XML",
      "sref": "sitemap"
    }];
   copyright_txt = "© 2013 - 2018 Lakeshore RV Center Powered By Integrity Media Group";
   return {
       addressInfo:function(){
           return $q.when(address);
       },
       footerLinkData:function(){
           return $q.when(footerLink);
       },
       copyrightInfo:function(){
           return $q.when(copyright_txt);
       }
   }
  }
})();

