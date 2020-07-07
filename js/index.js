//funciones a los botos de cambiar temas
let btnNight= document.getElementById('btn-night').addEventListener('click', function themeNight(){
	let bodyId= document.getElementById('body-id');
	
	bodyId.classList = 'light dark';
	document.getElementById('logo-dark').style.display="block";
	document.getElementById('logo-light').style.display="none";
})
let btnLight= document.getElementById('btn-day').addEventListener('click', function themeDay(){
	let bodyIdDay = document.getElementById('body-id');
	bodyIdDay.classList='light';
	document.getElementById('logo-light').style.display="block";
	document.getElementById('logo-dark').style.display="none";
})
//funcion de desplazar el dropdown de temas
let btnTheme= document.getElementById('div-theme').addEventListener('click', function showTheme(){
	let divTheme = document.getElementById('dropdown-theme');
	
	if (divTheme.style.display == "none") {
		divTheme.style.display = "block"
	} else {
		divTheme.style.display = "none"
	};
	return true;
})
//funcion desplazar search
document.getElementById('input-search').addEventListener('input', async function dropdownSearch(){
	let dropdownSearch= document.getElementById('div-hidden');
if (event.target.value){
	dropdownSearch.style.display="block";
	let itemsDropdown = await getSearchResult();
	itemsDropdown = itemsDropdown.splice(0,3); //borra desde 0 hasta 
	dropdownSearch.innerHTML="";
	itemsDropdown.forEach(element =>
		dropdownSearch.innerHTML+=
		`
		<div class="search-result" data-title="${element.title}"> ${element.title} </div>
		`
		)
	}
//llamar a la funcion get search result a lo que retorna la api guardarla en una variable que tenga un arreglo de gifs 
	//agarrar ese arreglo seleccionar los tres primeros tittle
	
else {
dropdownSearch.style.display= "none";
}
})
//funcion de buscar gifs
let btnSearch = document.getElementById('btn-search').addEventListener('click' ,(event)=> setSearchResult());
async function getSearchResult(query){
	
	let inputSearch= query || document.getElementById('input-search').value;
	let result = await fetch(`http://api.giphy.com/v1/gifs/search?q=${inputSearch}&api_key=ix1BLWrWqAyVCAN4QoNYxEQuBNxw3Mdl`)
	.then(response => response.json())
	.then((data) =>  data)
		console.log(result);
		return result.data;
}

document.getElementById('div-hidden').addEventListener('click', searchBySuggestion)
function searchBySuggestion(){
	if(event.target.dataset.title){
	setSearchResult(event.target.dataset.title)
	}
	
	console.log(event)
}	
async function setSearchResult(query){
	let searchData= await getSearchResult(query);
	let containerSearch= document.getElementById('wrapper-gifs-search');
	document.getElementById('div-hidden').style.display="none";
	document.getElementById('div-search').style.display="block";
	document.getElementById('container-giffos').innerHTML="";
	document.getElementById('input-search').value="";
	containerSearch.innerHTML="";
	
	searchData.forEach(
		gif=> (containerSearch.innerHTML+=

		`	
			
				<div class="gifs-search">
				<div id="gif-search" class="gif-search">
					<img class="giff-search"src="${gif.images.original.url}" alt="gif">
				</div>
				</div
		`
				
			)
	)
}



//buscar gifs en sugerencias
const suggestedWrapper = document.getElementById('giffos-suggestions');
let arrGifsRand =[];
async function randomGifs(){
	for (let index = 0; index < 4; index++) {
		await fetch('http://api.giphy.com/v1/gifs/random?&api_key=ix1BLWrWqAyVCAN4QoNYxEQuBNxw3Mdl')
		.then((response)=>{
			return response.json();
		})
		.then((data)=>{
			arrGifsRand[index] = data
		}
		)}
	

}
//mostrar en html los gifs de sugerencias
function addSuggestedGifs() {
	suggestedWrapper.innerHTML = "";
	arrGifsRand.forEach((gif, index) => suggestedWrapper.innerHTML+=
		`
			<div class= "wrapper-giffos">
				
				<div class="name-giffos"> <p>${gif.data.title}</p>
				<img class="close-icon" src="img/button3.svg" data-gifindex="${index}"  alt="close">
				</div>
				<div class="giffos">
				<div id="gif"class="giff">
				<img class="gif"src="${gif.data.images && gif.data.images.original.url}" alt="gif">
				</div>
				</div>
				<div class="btn-more">
				<a href="#">Ver más...</a>
				</div>
				
			</div>`)
}
//funcion para remover el gif

function removeGif() {

	console.log(event.target.dataset.gifindex);
}
//funcion a la x
randomGifs().then((res) => { 
	addSuggestedGifs()
	let suggestedGifs = document.getElementsByClassName("close-icon");
	for(let index = 0; index < suggestedGifs.length; index++) {
			suggestedGifs[index].addEventListener("click", removeGif);
		}
	});
	const scroll = () => {
		if (document.body.scrollHeight - window.innerHeight === window.scrollY) {
		  getTrendingGiffos(); //funcion que hace el fetch
		  addTrendingGifs(); //funcion que los agrega al html
		 }
	   }
	   
	   window.addEventListener('scroll', scroll)
//funcion para buscar los gifs en tendencias
let trendingGiffs = document.getElementById('wrapper-giffs');
async function getTrendingGiffos(){
	let response= await fetch('http://api.giphy.com/v1/gifs/trending?api_key=ix1BLWrWqAyVCAN4QoNYxEQuBNxw3Mdl&rating')
	let responseData = await response.json()
	let trendingGifs =responseData.data;
		/* console.log(trendingGifs); */
		return trendingGifs;
}
//funcion mostrar gifs tendencias
 async function addTrendingGifs() {
	let trendingGifs= await getTrendingGiffos();

	trendingGifs.forEach(
		gif=> (trendingGiffs.innerHTML+=
		`
			
			<div class="gifs-trending">
			<div class="aspect-radio-trending">
			<div id="gif-trending" class="gif-trending">
				<img class="giff-trending"src="${gif.images.original.url}" alt="gif">
			</div>
			</div>
			</div`
			)
	)
}
addTrendingGifs(); 
