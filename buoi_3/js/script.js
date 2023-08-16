
const button = document.getElementById('submitBtn');
const input = document.getElementById('username');
const delButton = document.getElementById('delBtn');

if(localStorage.getItem('arr') && localStorage.getItem('arr') != null) {
    var arr = JSON.parse(localStorage.getItem('arr'));
}else{
    var arr = [];
}

delButton.addEventListener('click', ()=>{
    if(confirm('Bạn có xóa không?')){
        if(localStorage.getItem('arr')){
            localStorage.removeItem('arr');
            alert('Đã xóa');
            window.location.reload();
        }
    }
})

button.addEventListener('click', ()=>{
    var name = input.value;
    if(name !=''){
        arr.push(name);
        var item = JSON.stringify(arr);
        localStorage.setItem('arr',item);
        window.location.reload();
    }else {
        alert('Chưa nhập tên');
    }
})
var str = show();
document.getElementById('result').innerHTML = str;
function show() {
    var item = localStorage.getItem('arr');
    var array = JSON.parse(item);
    if(array.length>0){
        var str = '';      
        array.forEach(element => {
            str += `
            <li>`+ element +`</li>
            `
        });
    }
    return str;
}

