// 클래스타입은 new라는 키워드를 이용해 객체 생성
let news = [];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu)=>menu.addEventListener("click",(event)=>{
    getNewsByTopic(event)
}));
let keywordInput = document.getElementById("search-input");
let searchButton = document.getElementById("searh-Btn");
let url;

//각함수에서 필요한 url을 만든다
//api 호출함수를 부른다

const getNews=async()=>{
    try{
        let header = new Headers({
            'x-api-key':'m5ZeijClFPNkczjTVtzMSaVAhDWUSOAnMQttBhPEWU4'
        });
        url.searchParams.set('page',page);//페이지를 따오기위함
        let response = await fetch(url,{headers: header});
         //ajax, http, fetch (데이터를 보내는 방식들)
        let data = await response.json(); 
        //response응답객체에서 json을 뽑아주는 것까지해야 인간이 이해할수있는 데이터가 확인가능
        if(response.status==200){
            if(data.total_hits==0){
                throw new Error("검색된 결과값이 없습니다.")
            }
            console.log("받는데이터?",data);
            news = data.articles; 
            total_pages = data.total_pages;
            page = data.page;
            console.log(news);
            render();
            pageNation();
        }else{
            throw new Error(data.message);
        } 
    }catch(error){
        errorRender(error.message);
    }
}


const getLatedNews = async()=>{
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&&page_size=10`);
    getNews();
};

const getNewsByTopic=async(event)=>{
    console.log("클릭!", event.target.textContent);

    let topic = event.target.textContent.toLowerCase();
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&&page_size=10&topic=${topic}`)
    getNews();
};
const getNewsByKeyword= async()=>{
    //1. 검색키워드 읽어오기
    //2. url에 검색키워드 붙이기
    //3. 헤더준비
    //4. url부르기
    //5. 데이터가져오기
    //6. 데이터 보여주기
    
    let keyword = document.getElementById("search-input").value;
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=KR&page_size=10`);
    
    getNews();
    keyword.value='';

};

keywordInput.addEventListener('keyup',(e)=>{
    if(e.key==='Enter'){
        if(keywordInput.value.length!==0){
            getNewsByKeyword();
        }else{
            alert("키워드를 입력해주세요.")
        }
    }
})



const render=()=>{
    let newsHTML = "";
    newsHTML = news.map((item) => {
        return `<div class="row news">
        <div class="col-lg-4">
            <img class="news-img-size" src="${item.media||"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"}">
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>${item.summary==null||item.summary==""?"내용없음":item.summary.length>200?item.summary.substring(0,200)+"...":item.summary}</p>
            <div>${item.twitter_account||"no source"} * ${moment(item.published_date).fromNow()}</div>
        </div>
    </div>`
    }).join('');

    document.getElementById("news-board").innerHTML = newsHTML;
};

// 에러핸들링
const errorRender = (message)=>{
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${message}
  </div>`;
    document.getElementById("news-board").innerHTML=errorHTML;
}

searchButton.addEventListener("click", getNewsByKeyword);
getLatedNews();

// 페이지네이션
const pageNation=()=>{
    let pageNationHTML = '';
    //total_page
    //page
    //page_group
    let pageGroup = Math.ceil(page/5)
    //last
    let last = pageGroup*5
    //first
    let first = last -4
    //first~last 
    pageNationHTML+=`<li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
      <span aria-hidden="true">&lt;</span>
    </a>
  </li>`

    for(let i=first; i<=last;i++){
        pageNationHTML += `<li class="page-item ${page==i?"active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
    }

    pageNationHTML += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})>
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>`

    document.querySelector(".pagination").innerHTML= pageNationHTML;
};

const moveToPage = (pageNum)=>{
    //1 이동하고싶은 페이지 알기
    page = pageNum;
    //2. 이동하고싶은 펭이지를 가지고 api를 다시 호출하기
    getNews();
}


// 검색창 
function openSearchBox(){
    let inputArea = document.getElementById("input-area");
    if(inputArea.style.display==="inline"){
        inputArea.style.display="none";
    }else{
        inputArea.style.display="inline";
    }
};

// 햄버거메뉴

function openNav(){
    document.getElementById("side-nav").style.width="250px";
    // document.getElementById("side-nav").style.display="block";
}

function closeNav(){
    document.getElementById("side-nav").style.width="0px";
    // document.getElementById("side-nav").style.display="none";
}