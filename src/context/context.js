import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';


const rootUrl = 'https://api.github.com';




const GithubContext = React.createContext();

//Provider, Consumer - Github.Provider

const GithubProvider = ({children})=>{
    const [githubUser,setGithubUser] = useState(mockUser);
    const [repos,setGithubRepos] = useState(mockRepos);
    const [followers,setGithubFollowers] = useState(mockFollowers);
    
    //request loading
    const [request,setRequest] = useState(0);
    const [loading,setloading] = useState(false);
    // errpr handling

    const [error,setError] = useState({show:false,msg:''});

    // Check rate

    const checkRequest = ()=>{
        axios(`${rootUrl}/rate_limit`)
        .then((data)=>{
            let{rate:{remaining}} = data.data;
            setRequest(remaining)
            if(remaining===0){
                toggleError(true,'You have no more request left! Come back in an hour')
            }
        })
        .catch((err)=>console.log(err))
    }

    const searchGithubUser = async(user)=>{
        toggleError();
        //setloading
        setloading(true);
    await  axios.all([
            axios(
              {
                method:'get',
                url:`${rootUrl}/users/${user}`,
              }
            ),

            axios(`https://api.github.com/users/${user}/repos?per_page=100`),
            axios(`https://api.github.com/users/${user}/followers`)
          ]
            
            )
            .then(axios.spread((user,repos,followers)=>{
                setGithubUser(user.data);
                setGithubRepos(repos.data);
                setGithubFollowers(followers.data);
            }))
            .catch(err=>console.log(err))
        setloading(false)
    }


    function toggleError(show=false,msg=''){
        setError({show,msg})
    }


    useEffect(checkRequest,[])

    return <GithubContext.Provider value={{githubUser,repos,followers,request,error,searchGithubUser,loading}}>
        {children}
    </GithubContext.Provider>
}


export {GithubProvider, GithubContext};
