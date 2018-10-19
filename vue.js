const projects = [
    "github-ynov-vue"
]

const accounts = [
    "teofiloJ",
    "raphaelCharre"
]

var filters = new Vue({
    el: '#filters',
    data: {
        projects: projects,
        accounts: accounts,
        project_selected: "",
        account_selected: "",
        commits_list: []
    },

    methods: {
        getCommit: function () {

            var scope = this;
            var owner = this.account_selected;
            var repo = this.project_selected;

            scope.commits_list = [];

            if (owner == "" && repo == "") {
                for (var account of accounts) {
                    for (var project of projects) {
                        getData(account, project);
                    }
                }
            }else if (owner == "" && repo != "") {
                for (var account of accounts) {
                    getData(account, repo);
                }
            }else if (owner != "" && repo == "") {
                for (var project of projects) {
                    getData(owner, project);
                }
            }else {
                getData(owner,repo);
            }


            function getData(owner, repo) {
                jQuery.ajax({
                    type: "GET",
                    url: "https://api.github.com/repos/" + owner + "/" + repo + "/commits",
                    dataType: 'json',
                    success: function (data) {
                        console.log(data)
                        var tab = [];
                        var res = {
                            liste : [],
                            login : owner,
                            repo : repo,
                            link : 'https://github.com/' + owner + '/' + repo
                        }
                        for (var element of data) {                            
                            res.liste.push(element);
                            //tab.push(res);
                            //tab.push(element);
                        }
                        scope.commits_list.push(res);
                    }
                })
            }
            var test = "https://api.github.com/repos/" + owner + "/" + repo + "/commits";
            console.log(test);

        }
    }
})
