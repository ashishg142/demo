(function(){
    "use strict";
    angular.module("IMGDMSAPI")
        .service("contentData",['$q',contentData]);
    function contentData($q){
        var content = { "para1":"Lakeshore RV carries a variety of floor plan types, including rear living, rear kitchen, front living, front kitchen, and the always-popular, family-friendly bunkhouse models. Each layout has its unique benefits and we’re proud to sell all the styles that our customers have come to love. At our dealership you will find the most popular RV brands, like Bighorn, Bullet, Cougar, Cyclone, Outback, and more. Our selection of New and Pre-owned RVs is huge, and we also offer a Custom Build option if you’d like to order an RV specific to your needs.",
                    "para2": "Search our inventory of RV floor plans to determine which layout works for your lifestyle. From the bunkhouse models that accommodate active camping families to toy haulers that allow you to bring your favorite outdoor toys along for ultimate recreational fun, you’re sure to find the right RV for you. Check them out!",
                "para3":"Visit Lakeshore RV in person or online to shop our expansive selection of New and Pre-owned RVs. We sell every type of floor plan to make it easy to find just what you're looking for!" };

       var planTyps = [{ "plan_title":"Bunkhouse","plan_no":"508" },
                        { "plan_title":"Den Area", "plan_no":"31" },
                        { "plan_title":"Fireplace", "plan_no":"75" },
                        { "plan_title":"Front Garage", "plan_no":"25" },
                        { "plan_title":"Front Kitchen", "plan_no":"35" },
                        { "plan_title":"Front Living", "plan_no":"66" },
                        { "plan_title":"Full Bath", "plan_no":"1072" },
                        { "plan_title":"Half Bath", "plan_no":"143" },
                        { "plan_title":"Loft", "plan_no":"109" },
                        { "plan_title":"Master Bath", "plan_no":"32" },
                        { "plan_title":"Outdoor Kitchen", "plan_no":"179" },
                        { "plan_title":"Outside Kitchen", "plan_no":"94" },
                        { "plan_title":"Patio Deck", "plan_no":"17" },
                        { "plan_title":"Rear Garage", "plan_no":"259" },
                        { "plan_title":"Rear Kitchen", "plan_no":"61" },
                        { "plan_title":"Rear Living", "plan_no":"298" },
                        { "plan_title":"Rear Slide", "plan_no":"30" }];
            return {
                contentInfo:function(){
                    return $q.when(content);
                },
                planInfo:function(){
                    return $q.when(planTyps);
                }
            }
    }
})();