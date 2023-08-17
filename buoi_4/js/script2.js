$(document).ready(function() {
    login();
    logout();
    loadData();
})
const url = 'https://students.trungthanhweb.com/api/';
// khai báo toast message
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }                                    
})
//Login
function login() {
    $('#loginBtn').click(function(event){
        event.preventDefault();
        var modal = $('#loginModal')
        $('#loginModal').modal('show');
        $('#submitLoginBtn').click(function(event) {
            event.preventDefault();
            var email = $('#email').val().trim();
            if(email == ''){
                
                Toast.fire({
                    icon: 'warning',
                    title: 'chưa nhập Email'
                })
            }
            else{
                $.ajax({
                    type : 'post',
                    url : 'https://students.trungthanhweb.com/api/checkLoginhtml',
                    data : {
                        email : email
                    },
                    dataType : 'JSON',
                    success : function(res) {
                        if(res.check == true){
                            console.log(res.apitoken);
                            localStorage.setItem('token', res.apitoken);
                            
                            Toast.fire({
                                icon: 'success',
                                title: 'Đăng nhập thành công'
                            }).then(()=>{
                                window.location.reload();
                            })
                        }
                        else{
                            
                            Toast.fire({
                                icon: 'error',
                                title: 'Đăng nhập thất bại'
                            }) 
                        }
                    }
                })
            }
        })
    })
}
//Logout
function logout() {
    $('#logoutBtn').click(function (e) { 
        e.preventDefault();
        if(localStorage.getItem('token') && localStorage.getItem('token') != null){
            localStorage.removeItem('token');
            Toast.fire({
                icon: 'info',
                title: 'Goodybe!!'
            }).then(()=>{
                $('#loginBtn').show();
                window.location.reload();
            })
           
        }
    });
}
//funtion LoadData lấy dữ liệu Brands, Categrories, Products
function loadData(){
    $('#todoTable').hide();
    $('#logoutBtn').hide();
    if(localStorage.getItem('token') && localStorage.getItem('token') != null){
        $('#logoutBtn').show();
        $('#loginBtn').hide();
        $.ajax({
            type: "get",
            url: url + "home",
            data: {
                apitoken : localStorage.getItem('token')
            },
            dataType: "JSON",
            success: function (res) {
                // Get value for dropdown Loại Sản Phẩm
                var categrories = res.categrories;
                if(categrories.length > 0){
                    str = '';
                    categrories.forEach(el => {
                        str +=`
                        <li>
                            <a class="dropdown-item text-primary" href="#">
                                `+el.name+`
                            </a>
                        </li>
                        `
                    });
                    $('#typePro').html(str);
                }
                // Get value for dropdown Thương Hiệu
                var brands = res.brands;
                if(brands.length > 0){
                    var str = '';
                    brands.forEach(el => {
                        str +=`
                        <li>
                            <a class="dropdown-item text-primary" href="#">
                                `+el.name+`
                            </a>
                        </li>
                        `
                    });
                    $('#thuonghieu').html(str);
                }
                // Get value for prouduct
                var products = res.products.data;
                
                if(products.length > 0){
                    var str = '';
                    products.forEach(el => {
                        str +=`
                        
                            <div class="col-12 col-lg-3 col-md-6">
                                <div class="card">
                                    <img src="https://students.trungthanhweb.com/images/53051839.png" class="card-img-top" alt="...">
                                    <div class="card-body">
                                        <h5 class="card-title">`+el.name+`</h5>
                                        <p class="card-text">`+Intl.NumberFormat('en-US').format(el.price)+`</p>
                                        <a href="#" class="btn btn-primary viewBtn">Chi tiết</a>
                                        <a href="#" class="btn btn-success addBtn">Thêm</a>
                                    </div>
                                </div>    
                            </div>
                        
                        `
                    });
                    $('#prouduct').html(str);
                }
            }
        });
    }
}

