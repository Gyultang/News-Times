// 클래스타입은 new라는 키워드를 이용해 객체 생성
let news = [];
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu)=>menu.addEventListener("click",(event)=>{
    getNewsByTopic(event)
}));

const getLatedNews = async()=>{
    let url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&&page_size=10`);
    let header = new Headers({
        'x-api-key':'H8NJzBcg7Sek-511YaP1QLOXFvlGMxDHhsvrofQf3xA'
    });
    let response = await fetch(url,{headers: header});
     //ajax, http, fetch (데이터를 보내는 방식들)
    let data = await response.json(); 
    //response응답객체에서 json을 뽑아주는 것까지해야 인간이 이해할수있는 데이터가 확인가능
    
    news = data.articles; 
    console.log(news);
    render();
};

const getNewsByTopic=async(event)=>{
    console.log("클릭!", event.target.textContent);

    let topic = event.target.textContent.toLowerCase();
    let url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&&page_size=10&topic=${topic}`)
    let header = new Headers({
        'x-api-key':'H8NJzBcg7Sek-511YaP1QLOXFvlGMxDHhsvrofQf3xA'
    });
    let response = await fetch(url,{headers: header});
    let data = await response.json(); 
    news=data.articles;
    render();

    console.log("토픽뉴스 데이터:", data);
}

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

    console.log(newsHTML);
    document.getElementById("news-board").innerHTML = newsHTML;
}

getLatedNews();





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