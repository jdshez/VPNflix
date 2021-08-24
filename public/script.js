// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello");


        function faqClick(e) {
            const el = e.target;
            // toggle plus sign
            const iconClass = el.childNodes[1].classList;
            iconClass.contains('closed') ? iconClass.replace('closed', 'open') : iconClass.replace('open', 'closed');
            // toggle open/close answer
            const answerClass = el.parentElement.childNodes[3].classList;
            answerClass.contains('closed') ? answerClass.replace('closed', 'open') : answerClass.replace('open', 'closed');
        }

        // make span containing '+' clickable triggering the parent button's function.
        function spanClick(e) {
            const el = e.target;
            event = new CustomEvent('click');
            el.parentElement.dispatchEvent(event);
        }

        function render(mov, i) {
            
            var movId;
            mov[i].id.startsWith("f-") ? movId = mov[i].id : movId = `f-${mov[i].id}`;
            console.log(movId);
            const movImg = mov[i].img;
            //const movId = `f-${mov[i].id}`;
            const movieCtr = newEl('div', {class: 'movie-ctr', id: movId});   // id: mov[i].id not unique when favs rendered on reload as f-id already!
            //const title = newEl('h4', {innerText: res[i].title});
            const img = newEl('img', {class: 'movie-img', src: mov[i].img, title: mov[i].title});
            //image ctr to add button overlay on hover
            const imgCtr = newEl('div', {class:'img-ctr'});
            const addBtn = newEl('img', {class: 'add-btn', id: movId, src:'https://cdn.glitch.com/beb33392-16d3-4390-b2b1-9b11e1330472%2Ftick.svg?v=1616207649829', onClick: `manageFav(event, ${[i]})`});
            imgCtr.appendChild(img);
            imgCtr.appendChild(addBtn);

            const flgCtr = newEl('div', {class: 'flg-ctr'});
            mov[i].flagsArr.forEach((flag, index) => {
                const flg = newEl('img', {class: 'flg', src: flag, title: mov[i].ctryArr[index]});
                flgCtr.appendChild(flg);
            })
            movieCtr.appendChild(imgCtr);
            movieCtr.appendChild(flgCtr);
            return movieCtr
        }

        function renderSearchRes(res, title, size) {
            const resultTitle = document.querySelector('.result-title');
            const result = document.querySelector('.results');
            const subTitle = newEl('h3', {innerText: `Results for "${title}"`});
            
            for (let i=0; i<size ; i++) {    //i<3, then tried res[i] !== undefined
                let movId = `s-${res[i].id}`;

                // Call render(res, i) which can be declared outside for re-use.
                const movieCtr = newEl('div', {class: 'movie-ctr', id: res[i].id});
                //const title = newEl('h4', {innerText: res[i].title});
                const img = newEl('img', {class: 'movie-img', src: res[i].img, title: res[i].title});
                //image ctr to add button overlay on hover
                const imgCtr = newEl('div', {class:'img-ctr'});
                //const addBtn = newEl('img', {class: 'add-btn', src:'img/add.png', onClick: `manageFav(${[i]})`});
                const addBtn = newEl('img', {class: 'add-btn', id: movId, src: 'https://cdn.glitch.com/beb33392-16d3-4390-b2b1-9b11e1330472%2Fadd.png?v=1616503472155', onClick: `manageFav(event, ${[i]})`});
                imgCtr.appendChild(img);
                imgCtr.appendChild(addBtn);

                const flgCtr = newEl('div', {class: 'flg-ctr'});
                res[i].flagsArr.forEach((flag, index) => {
                    const flg = newEl('img', {class: 'flg', src: flag, title: res[i].ctryArr[index]});
                    flgCtr.appendChild(flg);
                })
                //movieCtr.appendChild(title);
                movieCtr.appendChild(imgCtr);
                movieCtr.appendChild(flgCtr);
                resultTitle.appendChild(subTitle);
                result.appendChild(movieCtr);
            }
        }

        function movieSearch() {
            const res = document.querySelector('.results');
            const resultTitle = document.querySelector('.result-title');
            function clearRes() {
                res.innerHTML = '';
            }
            
            // retrieve search value
            const searchValue = document.querySelector('.search-input').value;
            // Clear UI before fetching search results
            document.querySelector('.search-input').value = '';
            resultTitle.innerHTML = '';
            clearRes();
            // Deploy loading spinner
            res.innerHTML = '<div id="loader"></div>';  //<div>One moment please...</div>
            // If spaces are between words then replace with %20 
            const searchMod = searchValue.replace (/ /g, "%20");
            let search = `https://unogs.com/search/${searchMod}?countrylist=21,23,26,29,33,307,45,39,327,331,334,265,337,336,269,267,357,65,67,392,268,402,408,412,447,348,270,73,34,425,46,78`;
            console.log(search);
            //make it an object to be converted to JSON in body
            let dataToSend = {search}; 
            
            // send to server
            
            fetch('/movies', {   
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            }).then(res => {
                return res.json();
            }).then(movies => {
                // clear ui ready for results
                clearRes();
                // 5/2/21 *Get size of movies and pass to renderSearchMovies( , , size)
                const movs = movies;
                const size = Object.keys(movs).length;
                console.log(size);
                // Include searchValue variable and use as a sub-title to the results
                // maybe check only call renderSearchRes if size>0
                if (size === 0) {
                    const subTitle = newEl('h3', {innerText: `Sorry, no results found for "${searchValue}"`});
                    resultTitle.appendChild(subTitle);
                    return
                };

                renderSearchRes(movies, searchValue, size);
                // Save 'movies'                
                state.searchMovies = movies;
                console.log(state);
                
                // check if fav exists, if so check for same img att in any of them if so change searched movie to tick
                if (state.favList.favs) {
                    for (let i=0; i<size; i++){ 
                        if (state.favList.favImg(movies[i].img)) {
                            const srchId = `s-${movies[i].id}`;
                            document.getElementById(srchId).setAttribute('src', 'https://cdn.glitch.com/beb33392-16d3-4390-b2b1-9b11e1330472%2Ftick.svg?v=1616207649829');
                        };
                    }
                }
            }).catch(err => console.log(err)) 
        };
    
        //Controller
        // Global State to contain: 
        // 1. search results- 'searchMovies' object
        // 2. Favourites List- 'favList' object with methods and 'favs' array containing lthe movies

        let state = {};
        
        function isSearched(img) { 

            for (let i=0; i<3; i++) {
                if (state.searchMovies[i].img === img) {
                    var srchIndex = i;
                    return srchIndex;
                } 
            }
        };

        //Favs Controller
        function manageFav(e, index) {
            //testing function
            //console.log(isSearched(imgRef));
            // Using the id attribute of movie clicked to get it's ID 
            console.log(e.target.getAttribute("id"));
            const currEl = e.target;
            console.log(currEl);
            const currID = e.target.getAttribute("id");
            if (currID.startsWith("s-")) {
                //console.log(true);
                //look up the movie's title
                const currTitle = state.searchMovies[index].title;
                const currImg = state.searchMovies[index].img;
                const currMovie = { ...state.searchMovies[index] }; //create a copy of the object so it doesn't reference original and change it! 
                //change start with id to f-
                const favId= currID.replace (/s-/, "f-");
                // change id of currMov to f-...
                currMovie.id = favId; 
                //console.log(favId);

                // Check if there is a favourites object, if not create one
                
                if (!state.favList) {
                    state.favList = new Favs();
                    if (!document.querySelector('.favourites-title')) {
                        const favTitle = newEl('div', {class: 'favourites-title'});
                        const favHeader = newEl('h3', {innerText: 'Watch List'});
                        favTitle.appendChild(favHeader);
                        document.querySelector('.grid-favs').appendChild(favTitle);
                    }
                
                }

                //Check if movie is not in Fav list already
                if (!state.favList.isFav(favId) && currEl.getAttribute("src") !== "https://cdn.glitch.com/beb33392-16d3-4390-b2b1-9b11e1330472%2Ftick.svg?v=1616207649829") { 
                    // add movie to favourites
                    const newFav = state.favList.addFav(currMovie);
                    console.log(state.favList);
                    
                    // change button img to tick
                    //const film = document.getElementbyId(currID);
                    //film.setAttribute('href', 'img/tick.svg');
                    e.target.setAttribute('src', 'https://cdn.glitch.com/beb33392-16d3-4390-b2b1-9b11e1330472%2Ftick.svg?v=1616207649829');

                    // add to UI
                    
                    renderFav(state.searchMovies, index) // could try and use selectedMov but have to change render()
                    
                } 
                 // if movie is in list remove it
                else if (state.favList.isFav(favId)) {
                     //remove from favourites list
                     state.favList.deleteFav(favId);
                    // remove from UI 
                    removeFav(favId);
                    // change tick back to add image on clicked movie in movie search UI use s-ID
                    //document.getElementbyId( currID ).setAttribute('href', 'img/add.png');
                    e.target.setAttribute('src', 'https://cdn.glitch.com/beb33392-16d3-4390-b2b1-9b11e1330472%2Fadd.png?v=1616503472155'); 
                    //
                    //if (state.favList.favSize() === 0) { //write checkFavs() i.e. state.favList.favs.length>0 ? true : false
                    //    document.querySelector('.favourites-title').innerHTML='';
                    //}
                }    
                else if (currEl.getAttribute("src") === "https://cdn.glitch.com/beb33392-16d3-4390-b2b1-9b11e1330472%2Ftick.svg?v=1616207649829") { // maybe add if (img = tick) That would maybe cover the above case too so could delete the favId conditional above
                    // Now need to delete by img href due to different ids being possible for same movie searched separately d'oh!
                    var newFavId;
                    state.favList.favs.forEach((ob) => {
                       if (ob.img === currImg) {
                           console.log(ob.id);
                           newFavId = ob.id;
                           return newFavId
                       }
                    });
                    console.log('This is target id ' + newFavId);
                    state.favList.deleteFav(newFavId);
                    //remove from UI
                    removeFav(newFavId); // alt re-render favs like load on searchmovie
                    // change tick back to add image on clicked movie in movie search UI use s-ID
                    e.target.setAttribute('src', 'https://cdn.glitch.com/beb33392-16d3-4390-b2b1-9b11e1330472%2Fadd.png?v=1616503472155');
                    //
                    //if (state.favList.favSize() === 0) { //write checkFavs() i.e. state.favList.favs.length>0 ? true : false
                    //    document.querySelector('.favourites-title').innerHTML='';
                    //} 
                }
            }
            else if (currID.startsWith("f-")) {
                console.log('starts with f');
                // delete from favourite list
                state.favList.deleteFav(currID);
                // remove from UI 
                removeFav(currID);

                // check it's not in search ui, if so need to change the tick to add!
                const imgCtr = e.target.parentElement;
                console.log(imgCtr.firstChild);
                const imgRef = imgCtr.firstChild.getAttribute('src');
                const srchMovInd = isSearched(imgRef);
                if ( srchMovInd !== -1) {
                   
                    console.log('index of search movie is: ' + srchMovInd);
                    const sID = `s-${state.searchMovies[srchMovInd].id}`;
                    document.getElementById(sID).setAttribute('src', 'https://cdn.glitch.com/beb33392-16d3-4390-b2b1-9b11e1330472%2Fadd.png?v=1616503472155');
                    //document.querySelector(`.results:nth-child(${i})`).setAttribute('src', 'img/add.png');
                    
                /*if (isSearched(imgRef)) {
                    const srchId = currID.replace(/f-/, "s-");
                    document.getElementById(srchId).setAttribute('src', 'img/add.png');
                   
                */
                    /*const i = searchedMov(imgRef);
                    const iCtr = document.querySelector(`results:nthchild(${i})`);
                    iCtr.
                    .setAttribute*/
                }

            }

        }
        
        //Page reloads retrieve favourites from local storage
        window.addEventListener('load', () => {
            state.favList = new Favs();

            state.favList.readStorage();
            console.log(state.favList);

            // add favourites to UI on reload
            const movs = state.favList.favs;
            const listSize = movs.length;
            for (let i=0; i<listSize; i++) {
                renderFav(movs, i)
            }
            
        }
        );

    //Favourites View

        function renderFav(movies, index) {
            const favs = document.querySelector('.favourites');
            //check if title exists to avoid repetition and if not create one
          
            const favTitle = document.querySelector('.favourites-title');
            if (!document.querySelector('.fav-header')) {
                //const favTitle = newEl('div', {class: 'favourites-title'});
                const favHeader = newEl('h3', {class: 'fav-header', innerText: 'Watch List'});
                favTitle.appendChild(favHeader);
                document.querySelector('.grid-favs').appendChild(favTitle);
            }
            
            favs.appendChild(render(movies, index));
            
        }

        function removeFav(id) {

            const ctr = document.getElementById(id);
            if (ctr) ctr.parentElement.removeChild(ctr);
        
            if (state.favList.favSize() === 0) { //write checkFavs() i.e. state.favList.favs.length>0 ? true : false
                document.querySelector('.favourites-title').innerHTML='';
            }
        }
            



    // Favourites model
        class Favs {
            constructor() {
                this.favs = [];
            }

            //addFav(id, title, img, ctryArr, flagsArr) {
            addFav(fav) {
                //const fav = {id, title, img, ctryArr, flagsArr};
                this.favs.push(fav);
                // save list to local storage
                this.saveFavs();

                //may need to return fav here
            }
            
            deleteFav(id) {
                // return index of fav which matches input id
                const index = this.favs.findIndex(el => el.id === id);
                this.favs.splice(index, 1);

                // Save to local storage
                this.saveFavs();
            }

            isFav(id) {
                // returns boolean 
                return this.favs.findIndex(el => el.id === id) !== -1;
            }

            favImg(img) {
                return this.favs.findIndex(el  => el.img === img) !== -1; 
            }
            
            favSize() {
                return this.favs.length;
            }

            saveFavs() {
                localStorage.setItem('favourites', JSON.stringify(this.favs));
            }

            readStorage() {
                const storage = JSON.parse(localStorage.getItem('favourites'));
                
                // Restoring likes from the localStorage
                if (storage) this.favs = storage;
            }
        
        }



        function newEl(type, props={}){
            const el = document.createElement(type);
            for (let x in props) {  // x is the key for each key-value pair in props object
                const propt = props[x];
                if (x =='innerText') {
                    el.innerText = propt; 
                } 
                else {
                    el.setAttribute(x, propt);
                }
            }
            return el;
        }       
        
        /*Mobile Menu toggling*/

        const burgerMenu = document.querySelector('.burger-menu');
        const mobMenu = document.querySelector('.nav-links');
        burgerMenu.addEventListener('click', () => {
            mobMenu.classList.toggle('active');
        });
        
        document.querySelector('.menu-link-1').addEventListener('click', () => {
            if (mobMenu.classList.contains('active')) {
            //document.getElementsByClassName('.nav-links.active ul li a)
            mobMenu.classList.toggle('active');
            }
        });
        document.querySelector('.menu-link-2').addEventListener('click', () => {
            if (mobMenu.classList.contains('active')) {
            //document.getElementsByClassName('.nav-links.active ul li a)
            mobMenu.classList.toggle('active');
            }
        });
        document.querySelector('.menu-link-3').addEventListener('click', () => {
            if (mobMenu.classList.contains('active')) {
            //document.getElementsByClassName('.nav-links.active ul li a)
            mobMenu.classList.toggle('active');
            }
        })
        
