

const calcLang=(repos)=>{
    
let languages = repos.reduce((total,item)=>{
    const {language, stargazers_count} = item
    if(!language) return total;
    if(!total[language]){
      total[language] = {label:language,value:1, stars:stargazers_count}
    }
    else{
      total[language] = {...total[language], value:total[language].value+1, stars: total[language].stars + stargazers_count}
    }
    
    return total;
  },{})

const mostUsed = Object.values(languages).sort((a,b)=>{
  return b.value - a.value;
}).slice(0,10);


//star and forks

let {stars, forks} = repos.reduce((total,item)=>{
    const {stargazers_count,name,forks} = item;
    total.stars[name] = {label:name,value:stargazers_count}

    total.forks[name] = {label:name,value:forks}
    return total
},{stars:{}, forks:{}})

// most popular 
stars = Object.values(stars).sort((a,b)=>b.value - a.value).slice(0,5);
forks = Object.values(stars).sort((a,b)=>b.value - a.value).slice(0,5);
console.log(stars)
const mostPopular = Object.values(languages).sort((a,b)=>{
    return b.stars - a.stars;
}).map((item)=>{
    return {...item, value:item.stars}
}).filter(item=> item.value!==0);


return {mostUsed, mostPopular,stars,forks};
}

export default calcLang;