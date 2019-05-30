let safe_text = text => {
    let dummy = document.createElement('div');
    dummy.textContent = text;
    return dummy.innerHTML;
};



let create_alert = (title, description, level) => {

    let colors = {
        alert: 'red',
        info: 'blue',
        success: 'green',
        chat: 'blue'
    };

    if(!level) level = 'alert';
    let notify = document.createElement('div');
    notify.classList = 'alert';

    let icon = document.createElement('div');
    icon.classList = 'alert-left color-' + colors[level];
    switch(level){
        case 'alert':
            icon.innerHTML='<span class="alert-icon mdi mdi-alert-circle-outline"></span>';
            break;
        case 'info':
            icon.innerHTML='<span class="alert-icon mdi mdi-information-outline"></span>';
            break;
        case 'success':
            icon.innerHTML='<span class="alert-icon mdi mdi-check-circle-outline"></span>';
            break;
        case 'chat':
            icon.innerHTML='<span class="alert-icon mdi mdi-message-outline"></span>';
            break;
    }
    notify.append(icon);

    let headline = document.createElement('div');
    headline.classList = 'alert-title';
    headline.innerHTML = title || 'Untitled';
    notify.append(headline);

    let text = document.createElement('div');
    text.classList = 'alert-text';
    text.innerHTML =  description || 'No description';
    notify.append(text);

    let timer = document.createElement('div');
    timer.classList = 'alert-timer';
    notify.append(timer);

    document.body.append(notify);

    setTimeout(() => {                     
        notify.style.animation = 'plopOut .3s cubic-bezier(0.15, 0, 1, -0.5)';
        setTimeout(() => {                     
            document.body.removeChild(notify);
        }, 290);
    }, 3800);
};

let create_message = msg => {
    // Header (Author/Time)
    let header = document.createElement('div');

    let author = document.createElement('span');
    author.classList = 'message-author';
    author.style = 'color:' + msg.author.color;
    author.append(document.createTextNode(msg.author.name + ' '));

    let time = document.createElement('span');
    time.classList = 'message-time';
    time.innerHTML = new Date(Date(message.createdAt).toString()).toUTCString();

    header.append(author);
    header.append(time);

    // Content
    let innerText = safe_text(msg.content);

        // URL Validation
        let urls = innerText.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm);
        if(urls) urls.forEach(u => {
            innerText = innerText.replace(u, `<a target="_blank" href="${u}">${u}</a>`);
        });

    let content = document.createElement('span');
    content.classList = 'message-content';
    content.id = 'message-content-' + msg.id;
    content.innerHTML = innerText;


    // Message
    if(last.author.id == msg.author.id){
        document.getElementById('message-' + last.id).append(document.createElement('br'));
        document.getElementById('message-' + last.id).append(content);
    }
    else{
        let message = document.createElement('div');
        message.classList = 'message';
        message.append(header);
        message.append(content);

        message.id = 'message-' + msg.id;
        last.id = msg.id;
        document.getElementById('messages-container').append(message);
        
        $(message).on('mousedown', e => {
            e.preventDefault();
            if(e.which == 3){
                create_context('message', msg, e);
            }
        });
    }
    last.author = msg.author;

};

let create_banner = al => {
    let sys = document.createElement('div');
    sys.classList = 'message';
    sys.style.borderLeft = '4px solid #ccc';
    sys.style.borderRadius = '0 10px 10px 0';
    sys.innerHTML = al;

    last.author = '';
    last.id = '';

    document.getElementById('messages-container').append(sys);
    document.getElementById('scroller').scrollTo(0,document.getElementById('scroller').scrollHeight);
};

function channel(channel){
    chat_channel = channel;
    $('.channel').removeClass('active');
    $('#channel-' + channel).addClass('active');
}

let create_user = acc => {
    if(acc.status != 'online') return;
    let userList = document.createElement('div');
    userList.classList = 'online-user';
    userList.id = 'online-user-' + acc.id;

    let avatar = document.createElement('img');
    avatar.src = acc.avatar;
    avatar.classList = 'online-user-avatar';

    userList.append(avatar);
    userList.append(document.createTextNode(acc.name));

    $(userList).on('mousedown', e => {
        e.preventDefault();
        if(e.which == 3) create_context('user', acc, e);
        else if(e.which == 1) create_profile(acc);
    });

    $('#online-users').append(userList);
};

let create_channel = c => {
    c = c[1];

    let types = {
        text: '<span class="mdi mdi-pound"></span>',
        news: '<span class="mdi mdi-bullhorn"></span>',
        voice: '<span class="mdi mdi-volume-high"></span>',
        nsfw: '<span class="mdi mdi-alert"></span>'
    };

    let channele = document.createElement('div');
    channele.classList = `channel${(c.name == 'general' ? ' active' : '')}`;
    channele.innerHTML = types[c.type] + ' ' + c.name;
    $(channele).on('click', () => {
        channel(c.id);
    });
    channele.id = 'channel-' + c.id;

    $(channele).on('mousedown', e => {
        e.preventDefault();
        if(e.which == 3){
            create_context('channel', c, e);
        }
    });

    $('#channels').append(channele);
};

let channel_list = channels => {
    channels.forEach(c => {
        create_channel(c);
    });
};

let create_profile = user => {
    let card = document.createElement('div');
    card.classList = 'profile-card';

        let head = document.createElement('div');
        head.classList = 'profile-card-head color-green';

            let avatar = document.createElement('img');
            avatar.classList = 'profile-card-head-avatar';
            avatar.src = user.avatar;

            let username = document.createElement('div');
            username.classList = 'profile-card-username';
            username.append(document.createTextNode(user.name));

        head.append(avatar);
        head.append(username);


        let data = document.createElement('div');
        data.classList = 'profile-card-data';

            let data_categ = [
                ['id', 'ID'],
                ['status', 'Status'],
                ['createdAt', 'Signed Up'],
                ['color', 'Chat color']
            ];

            data_categ.forEach(c => {
                let headline = document.createElement('div');
                headline.classList = 'small-headline';
                headline.innerHTML = c[1];

                data.append(headline);

                if(c[0] == 'createdAt') data.append(document.createTextNode( new Date(user[c[0]]).toLocaleString() ));
                else data.append(document.createTextNode( user[c[0]] ));
                data.append(document.createElement('br'));
            });

        
            let foot = document.createElement('div');
            foot.classList = 'form-footer profilecard';

                let fr_req = document.createElement('button');
                fr_req.classList = 'button form-input disabled';
                fr_req.innerHTML = 'Send Friend Request';

                let close = document.createElement('button');
                close.classList = 'button form-input';
                close.onclick = () => {
                    document.getElementById('appends').removeChild(card);
                };
                close.innerHTML = 'Close';

            foot.append(fr_req);
            foot.append(close);
        
        card.append(head);
        card.append(data);
        card.append(foot);

        $('#appends').append(card);
};


let copyToClipboard = id => {
    try{
        navigator.clipboard.writeText(id);
        create_alert('Copied to clipboard', safe_text(id), 'info');
    }
    catch(err){
        create_alert('Woops!', 'Looks like your Browser doesn\'t support this action.', 'info');
    }
};