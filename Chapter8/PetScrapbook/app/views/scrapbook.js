var observable = require("data/observable");
var observableArray = require("data/observable-array");
var fileSystem = require("file-system");

exports.onLoaded = function(args) {
    var page = args.object;
    var file = fileSystem.knownFolders.documents().getFile("scrapbook.json").readTextSync();
    var emptyScrapbookPage = new observable.Observable({
        genders: ["Female", "Male", "Other"],
        calcAge: function(year, month, day){
            var date = new Date(year, month, day);
            var now = Date.now();
            var diff = Math.abs(now - date) / 1000 / 31536000;

            return diff.toFixed(1);
        }
    });
    var scrapbook = new observable.Observable({
        pages: new observableArray.ObservableArray(emptyScrapbookPage)
    });

    if(file.length !== 0){
        var pages = JSON.parse(file);
        pages.forEach(function(item){
            scrapbook.pages.push(new observable.Observable({
                genders: ["Female", "Male", "Other"],
                calcAge: function(year, month, day){
                    var date = new Date(year, month, day);
                    var now = Date.now();
                    var diff = Math.abs(now - date) / 1000 / 31536000;

                    return diff.toFixed(1);
                },
                title: item.title,
                gender: item.gender,
                year: item.year,
                month: item.month,
                day: item.day
            }));
        });
    }

    page.bindingContext = scrapbook;
};

exports.onTap = function(args) {
    var page = args.object;
    var scrapbook = page.bindingContext;
    var file = fileSystem.knownFolders.documents().getFile("scrapbook.json");
    var pages = [];
    
    scrapbook.pages.forEach(function (item) {
        pages.push({
            gender: item.gender, 
            year: item.year, 
            month: item.month, 
            day: item.day, 
            title: item.title
        });
    });

    var json = JSON.stringify(pages);

    file.writeText(json);
}