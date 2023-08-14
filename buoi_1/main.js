// alert('xin chào Vũ')
// var name = prompt('Nhập tên của bạn')
// alert('Tôi tên là: '+ name )
var arr = [];
function getName() {
    var name = '';
    name = document.getElementById('name').value;
    arr.push(name);
    const div = document.getElementsByClassName('div1');
    // console.log(arr);

    var str = '';
    arr.forEach(el => {
        str +=el + `<br>`;
    });
    // console.log(str);
    div[1].innerHTML = str;
}





