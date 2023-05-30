

const ItemCtrl = (function(){
   
    const Item = function(id, url, shortUrl){
        this.id = id;
        this.url = url;
        this.shortUrl = shortUrl;
    };

   
    const data = {
        items: [
            // {id:0, url:'http://www.hello.com', shortUrl:'http://sho.link.j8t5'},
            // {id:1, url:'http://www.bye.com', shortUrl:'http://show.link/7hk9'}
        ],
        currentItem: null
    };

    
    return{
        logData: function(){
            return data;
        },
        addLink: function(link){
            let ID;
           
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            let shortLink;
            shortLink = ItemCtrl.generateLink();
           
            newItem = new Item(ID, link, shortLink);
     
            data.items.push(newItem);

            return newItem;
        },
      
        generateLink: function(){
            const c1 = ItemCtrl.generateCharacter();
            const c2 = ItemCtrl.generateCharacter();
            const c3 = ItemCtrl.generateCharacter();
            const c4 = ItemCtrl.generateCharacter();

            return 'http://sho.link/'+c1+c2+c3+c4;
        },
   
        generateCharacter: function(){
            const arr = 'abcdefghijklmnopqrstuvwxyz1234567890';
            return arr[Math.floor(Math.random()*arr.length)];
        },
    
        getItemById: function(id){
            let found = null;
         
             data.items.forEach(function(item){
                if(item.id ===  id){
                    found = item;
                    }
                })
                   return found;
        },
        setCurrentLink: function(link){
            data.currentItem = link;

            return data.currentItem.shortUrl;
        }

    }
})();


const UICtrl = (function(){
   
    const UISelectors = {
        linkInput: '#shortener',
        shortItBtn: '#submit__btn',
        linksContainer: '.links__container',
        errorMsg: '.error__msg',
        colyLink: '.copy__btn'
    }


    return{
        getSelectors: function(){
            return UISelectors;
        },
      
        getLinkInput: function (){
            return {
                longLink: document.querySelector(UISelectors.linkInput).value
            }
        },
     
        errorLink: function(){
            const errorMsg = document.querySelector(UISelectors.errorMsg);
            errorMsg.className = 'error__msg show';

            setTimeout(function(){
                errorMsg.className = 'error__msg'
            }, 3000);

            UICtrl.clearInput()
        },
       
        clearInput: function(){
            document.querySelector(UISelectors.linkInput).value = '';
        },
      
        addListLink: function(item){
           
            const div = document.createElement('div');
          
            div.className = 'link';
       
            div.id = `link-${item.id}`;
      
            div.innerHTML = `
            <span class="long__link">${item.url}</span>
            <span class="short__link">${item.shortUrl}</span>
            <button class="copy__btn">Copy</button>
            `;
         
            document.querySelector(UISelectors.linksContainer).insertAdjacentElement('beforeend', div);
        },
        copyShortLink: function(link){
            const textarea = document.createElement('textarea');
            const copiedLink = link;

            textarea.value = copiedLink;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
        },
        changeButton: function(btn){
            btn.style.backgroundColor = '#21243d';
            btn.style.color = 'white';
            btn.innerHTML = 'Copied!';
        }
    }
})();

const App = (function(ItemCtrl, UICtrl){
    
    const loadEventListeners = function (){
       
        const UISelectors = UICtrl.getSelectors();
        
        document.querySelector(UISelectors.shortItBtn).addEventListener('click', addLink);
   
        document.querySelector(UISelectors.linksContainer).addEventListener('click', copyLink);
    }


    const addLink = function(e){
      
        const input = UICtrl.getLinkInput();

    
        if(input.longLink !== ''){
            const re = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

            if(re.test(input.longLink) == false){
              
                UICtrl.errorLink();
            } else if(re.test(input.longLink) ==  true){
       
                const newLink = ItemCtrl.addLink(input.longLink);
             
                UICtrl.addListLink(newLink);
        
                UICtrl.clearInput();
            }
        }
       

        e.preventDefault();
    };


    const copyLink = function(e){
        if(e.target.classList.contains('copy__btn')){
         
            const linkId = e.target.parentNode.id;
          
            const linkArr = linkId.split('-');
        
            const id = parseInt(linkArr[1]);
    
            const linkToCopy = ItemCtrl.getItemById(id);
          
            const currentLink = ItemCtrl.setCurrentLink(linkToCopy);
           
            UICtrl.copyShortLink(currentLink);
        
            UICtrl.changeButton(e.target);
            
        }
        
    }

 
    return{
        init: function(){
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

App.init();