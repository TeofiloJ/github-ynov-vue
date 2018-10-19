const projects = [
    "github-ynov-vue"
]

const accounts = [
    "Killy85",
    "Nair0fl",
    "raphaelCharre",
    "mathiasLoiret",
    "thomaspich",
    "TeofiloJ",
    "Grigusky",
    "Dakistos",
    "KevinPautonnier",
    "BenoitCochet",
    "sfongue",
    "ClementCaillaud",
    "gfourny",
    "Mokui",
    "LordInateur",
    "AntoineGOSSET",
    "etienneYnov",
    "Coblestone",
    "AlexDesvallees",
    "rudy8530",
    "benjaminbra",
    "mael61",
    "alixnzt"
];

var filters = new Vue({
    el: '#filters',
    data: {
        projects: projects,
        accounts: accounts,
        project_selected: "",
        account_selected: "",
        time_start: "",
        time_end: "",
        auth_user:"",
        auth_token:"",
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
            } else if (owner == "" && repo != "") {
                for (var account of accounts) {
                    getData(account, repo);
                }
            } else if (owner != "" && repo == "") {
                for (var project of projects) {
                    getData(owner, project);
                }
            } else {
                getData(owner, repo);
            }


            function getData(owner, repo) {

                var res = {
                    liste: [],
                    login: owner,
                    repo: repo,
                    name: "",
                    readme: "",
                    link: 'https://github.com/' + owner + '/' + repo
                }

                //console.log("https://api.github.com/repos/" + owner + "/" + repo + "/commits",)
                jQuery.ajax({
                    type: "GET",
                    url: "https://api.github.com/repos/" + owner + "/" + repo + "/commits",
                    dataType: 'json',
                    beforeSend: function (xhr) {
                        if(scope.auth_token && scope.auth_user){
                            xhr.setRequestHeader ("Authorization", "Basic " + btoa(scope.auth_user + ":" + scope.auth_token));
                        } 
                    },
                    success: function (data) {
                        for (var element of data) { 

                            var dateCommit = new Date(element.commit.author.date).getTime();
                            var dateDebut = new Date(scope.time_start);
                            var dateFin = new Date(scope.time_end)
                            dateFin.setDate(dateFin.getDate() + 1)

                            if (scope.time_start != "" && scope.time_end != "") {
                                if (dateCommit >= new Date(scope.time_start).getTime() && dateCommit <= dateFin.getTime()) {
                                    res.liste.push(element);
                                    res.name = element.commit.author.name;
                                }
                            } else if (scope.time_start == "" && scope.time_end != "") {
                                if (dateCommit <= dateFin.getTime()) {
                                    res.liste.push(element);
                                    res.name = element.commit.author.name;
                                }
                            } else if (scope.time_start != "" && scope.time_end == "") {
                                if (dateCommit >= dateDebut.getTime()) {
                                    res.liste.push(element);
                                    res.name = element.commit.author.name;
                                }
                            } else {
                                res.liste.push(element);
                                res.name = element.commit.author.name;
                            }

                        }
                        res.liste = res.liste.slice(0, 5);

                        //console.log("https://api.github.com/repos/" + owner + "/" + repo + "/readme")
                        jQuery.ajax({
                            type: "GET",
                            url: "https://api.github.com/repos/" + owner + "/" + repo + "/readme",
                            dataType: 'json',
                            beforeSend: function (xhr) {
                                if(scope.auth_token && scope.auth_user){
                                    xhr.setRequestHeader ("Authorization", "Basic " + btoa(scope.auth_user + ":" + scope.auth_token));
                                } 
                            },
                            success: function (data) {
                                res.readme = atob(data.content); 
                            }
                        })
                        scope.commits_list.push(res);
                    }
                })

            }
        },
    }
})
