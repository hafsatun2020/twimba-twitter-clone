import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let tweetsFromLS = JSON.parse(localStorage.getItem("tweets"))
let newTweetData = tweetsData
const signUpBox = document.getElementById('sign-up')
const cancelbtn = document.getElementById('cancel-btn')
const signBtn = document.getElementById('sign-up-btn')
const form = document.getElementById('sign-up-form')
const body = document.querySelector('body')
const user = {
    handle:`@Scrimba`

}


if (tweetsFromLS) {
    newTweetData = tweetsFromLS
 }

 setTimeout(function(){
    signUpBox.style.display = 'block'
    cancelbtn.disabled = true
    body.style.overflow = 'hidden'

 }, 3000)

 signBtn.addEventListener('click', function(){
    const signUpFormData = new FormData(form)
    const name = signUpFormData.get('u-fullname')
    console.log(name)
    document.getElementById('form').innerHTML =`<p id="message">Thank you for Signing Up <span> ${name}!</span></p>`
    cancelbtn.disabled = false
    


    document.addEventListener('click', function(e){
    
    
        if(e.target.dataset.like) {
             handleLikeClick(e.target.dataset.like) 
        }else if (e.target.dataset.retweet) {
           handleRetweetClick(e.target.dataset.retweet)
        } else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
        } else if(e.target.id === 'tweet-btn') {
            handleTweetBtnClick()
        } else if(e.target.dataset.replybtn){
           handleReplyTweetBtnClick(e.target.dataset.replybtn)
        } else if(e.target.dataset.deletebtn) {
            handleClickDelete(e.target.dataset.deletebtn)
        }  else if (e.target.dataset.deletereply) {
            handleClickDeleteReply(e.target.dataset.deletereply)
            console.log(e.target.dataset.deletereply.parentElement)
            render()
        }
})
 })

cancelbtn.addEventListener('click', function(){
    signUpBox.style.display = 'none'
    body.style.overflow = 'auto'
})




function handleClickDeleteReply(replyId) {
    let newD = newTweetData
    
    newD.forEach(function(tweet){

     tweet.replies = tweet.replies.filter(function(reply){

                return reply.uuid !== replyId


                })
                
        
        
    })
render()
 
}

function handleClickDelete(tweetId) {
    newTweetData = newTweetData.filter(function(tweet){
        return tweet.uuid !== tweetId
    })

        //localStorage.clear()
        render()
    
    
}

function handleLikeClick(tweetId){
    
    const targetTweetObj = newTweetData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(!targetTweetObj.isLiked) {
      targetTweetObj.likes++
    } else {
         targetTweetObj.likes--
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked 
     render()  
    
   // console.log(targetTweetObj.likes)
    
}




function handleRetweetClick(tweetId){
    const targetTweetObj = newTweetData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(!targetTweetObj.isRetweeted){
        targetTweetObj.retweets++ 
    }else {
        targetTweetObj.retweets--
    }
    
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()
}

function handleReplyClick(replyId){
    
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    
}


function handleReplyTweetBtnClick(replyId) {
    const targetTweetObj = newTweetData.filter(function(tweet){
        return tweet.uuid === replyId
    })[0]
   
    let replyInput = document.getElementById(`reply-input-${replyId}`)
      
      
          if(replyInput.value){
            targetTweetObj.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: `${replyInput.value}`,
            uuid: uuidv4()
        })

        replyInput.value = ""
        render()
    
     }
      
    
   
   
}



function handleTweetBtnClick() {
    
    let tweetInput = document.getElementById('tweet-input')
  
    if(tweetInput.value){
        newTweetData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        tweetInput.value = ""
    render()
    }
    
    

}


function getFeedHtml(){
    
    
      let feedHtml = ''
    newTweetData.forEach(function(tweet){
        let likeIconClass = ''
         let retweetIconClass = ''
    
                if(tweet.isLiked){
                    likeIconClass = 'liked'
                }
                
                if(tweet.isRetweeted){
                    retweetIconClass = 'retweeted'
                }
                
                let repliesHtml = ''
                if(tweet.replies.length > 0){
                    //console.log(tweet.uuid)
                    
                     tweet.replies.forEach(function(reply){
                     if(reply.handle === user.handle){
                        repliesHtml +=`  
                        <div class="tweet-reply" id="${reply.uuid}">
                            <div class="tweet-inner">
                                <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                    <i class="fa-solid fa-trash" data-deletereply="${reply.uuid}"></i>
                                </div>
                            </div>
                            
                        </div>` 
                     }

                     else{
                        repliesHtml +=`  
                        <div class="tweet-reply" id="${reply.uuid}">
                            <div class="tweet-inner">
                                <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                   
                                </div>
                            </div>
                            
                        </div>` 

                     }
                       
                     })
                  
                }
        if(tweet.handle == user.handle){
            feedHtml += `
            <div class="tweet" id="tweet">
                <div class="tweet-inner" id="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            
                            
                            <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                              ${tweet.replies.length}
                            </span>
                            
                            
                            
                            <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                                ${tweet.retweets}
                            </span>
                            <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                                ${tweet.likes} 
                            </span>
                            
                            <span class="tweet-detail">
                            
                            
                            <i class="fa-solid fa-trash" data-deletebtn="${tweet.uuid}"></i>
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                   ${repliesHtml}
                   <textarea id="reply-input-${tweet.uuid}"></textarea> 
                   <button type="submit" id="tweet-btn-reply" data-replybtn="${tweet.uuid}">Tweet</button>
                </div>   
            </div>
            `
        } else{
            feedHtml += `
            <div class="tweet" id="tweet">
                <div class="tweet-inner" id="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            
                            
                            <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                              ${tweet.replies.length}
                            </span>
                            
                            
                            
                            <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                                ${tweet.retweets}
                            </span>
                            <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                                ${tweet.likes} 
                            </span>
                            
                        
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                   ${repliesHtml}
                   <textarea class="reply-input" id="reply-input-${tweet.uuid}"></textarea> 
                   <button type="submit" id="tweet-btn-reply" data-replybtn="${tweet.uuid}">Tweet</button>
                </div>   
            </div>
            `
                    
                    
        }
       
    })
    return feedHtml
}

getFeedHtml()


function render(){
    
    document.getElementById('feed').innerHTML = getFeedHtml()
    localStorage.setItem('tweets', JSON.stringify(newTweetData))
    
}

render()


