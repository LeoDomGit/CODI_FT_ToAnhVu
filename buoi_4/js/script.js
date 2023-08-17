$(document).ready(function() {
          login();
          createTodo();
          show();
          logout();
})
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
//Tạo todo
function createTodo(){
    if(!localStorage.getItem('token') || localStorage.getItem('token') == null){
        $('#addTodoBtn').attr('disabled','disabled');
    }
    $('#addTodoBtn').click(function(event){
        event.preventDefault;
        var todo = $('#todo').val().trim();
        if(todo == ''){
            Toast.fire({
                icon: 'warning',
                title: 'Chưa nhập nội dung'
            })
        }
        else{
            $.ajax({
                type : 'post',
                url : 'https://students.trungthanhweb.com/api/todo',
                data : {
                    apitoken : localStorage.getItem('token'),
                    todo : todo
                },
                dataType : 'JSON',
                success : function(res) {
                    if(res.check == true){                   
                        Toast.fire({
                            icon: 'success',
                            title: 'Nhập OK'
                        }).then(()=>{
                            window.location.reload();
                        })
                    }               
                    if(res.msg.apitoken){                   
                        Toast.fire({
                            icon: 'error',
                            title: 'Apitoken sai'
                        }) 
                    }
                    else if(res.msg.todo){                        
                        Toast.fire({
                            icon: 'error',
                            title: 'Chưa có todo'
                        }) 
                    }
                  
                }
            })
        }
    })
}
// Show
function show(){
    $('#todoTable').hide();
    $('#logoutBtn').hide();
    if(localStorage.getItem('token') && localStorage.getItem('token') != null){
        $('#logoutBtn').show();
        $('#loginBtn').hide();
        $.ajax({
            type: "get",
            url: "https://students.trungthanhweb.com/api/todo",
            data: {
                apitoken : localStorage.getItem('token')
            },
            dataType: "JSON",
            success: function (res) {
                const todo = res.todo;
                if(todo.length > 0){
                    var str = '';
                    var stt = 1;
                    todo.forEach((element,key) => {
                        if(element.status == 0){
                            str +=`
                            <tr>
                                <th scope="row"><p class=""todo>`+(stt++)+`</p></th>
                                    <td>`+element.note+`</td>
                                    <td>
                                        <input type="checkbox" class="finish" data-id="`+element.id+`">
                                    </td>
                                    <td>
                                        <div class="d-grid gap-2 d-md-flex justify-content-center">
                                            <button class="btn btn-warning me-md-2 editBtn" type="button" data-id="`+element.id+`" data-key="`+key+`" data-value="`+element.note+`">Edit</button>
                                            <button class="btn btn-danger delBtn" type="button" data-id="`+element.id+`">Delete</button>
                                        </div>
                                    </td>
                            </tr>
                            `
                        }
                        else if(element.status == 1){
                            str +=`
                            <tr>
                                <th scope="row"><p class=""todo>`+(stt++)+`</p></th>
                                    <td>`+element.note+`</td>
                                    <td>
                                        <input type="checkbox" class="finish" disabled checked data-id="`+element.id+`">
                                    </td>
                                    <td>
                                        <div class="d-grid gap-2 d-md-flex justify-content-center">
                                            <button class="btn btn-warning me-md-2 editBtn" disabled type="button"  data-id="`+element.id+`" data-key="`+key+`" data-value="`+element.note+`">Edit</button>
                                            <button class="btn btn-danger delBtn" type="button" data-id="`+element.id+`">Delete</button>
                                        </div>
                                    </td>
                            </tr>
                            `
                        }
                    }) ;  
                        
                    $('#result').html(str);
                    $('#todoTable').show();
                }
                deleteTodo();
                editTodo();
                finish();
            }
        });
    }
}
//Finish Funtion for checkbox Todo
function finish(){
    $('.finish').change(function (e) { 
        e.preventDefault();
        var id = $(this).attr('data-id');
        Swal.fire({
            title: 'Bạn có chắc đã hoàn thành Nhiệm vụ?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $.ajax({
                    type: "post",
                    url: "https://students.trungthanhweb.com/api/statusTodo",
                    data: {
                        apitoken : localStorage.getItem('token'),
                        id : id
                    },
                    dataType: "JSON",
                    success: function (res) {
                        if(res.check == true){
                            Toast.fire({
                                icon: 'success',
                                title: 'Misson Complete'
                            }).then(()=>{
                                window.location.reload();
                            })
                        }
                        else if(res.msg.apitoken){
                            Toast.fire({
                                icon: 'error',
                                title: response.msg.apitoken
                            })
                        }
                        else if(res.msg.id){
                            Toast.fire({
                                icon: 'error',
                                title: response.msg.id
                            })
                        }
                    }
                });
              
            } else if (result.isDenied) {
              Swal.fire('Tiến tục hoàn thành Task', '', 'info').then(()=>{
                window.location.reload();
              })
            }
        })
    });
}
//Delete Todo
function deleteTodo(){
    $('.delBtn').click(function (e) { 
        e.preventDefault();
        var id = $(this).attr('data-id');
        Swal.fire({
            title: 'Bạn có chắc muốn xóa?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Delete',
            denyButtonText: `Ấn nhầm thôi!`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              $.ajax({
                type: "post",
                url: "https://students.trungthanhweb.com/api/deletetodo",
                data: {
                    id : id,
                    apitoken : localStorage.getItem('token')
                },
                dataType: "JSON",
                success: function (response) {
                    if(response.check == true){                       
                        Toast.fire({
                            icon: 'success',
                            title: 'Xóa OK'
                        }).then(()=>{
                            window.location.reload();
                        })
                    }
                    else if(response.check == false){
                        if(response.msg.apitoken){                            
                            Toast.fire({
                                icon: 'error',
                                title: response.msg.apitoken
                            })

                        }
                        else if(response.msg.id){                           
                            Toast.fire({
                                icon: 'error',
                                title: response.msg.id
                            })
                        }
                    }
                }
              });
            } else if (result.isDenied) {
              
            }
          })
    });
}
//Edit Todo
function editTodo(){
    $('.editBtn').click(function (e) { 
        e.preventDefault();
        var id = $(this).attr('data-id');
        var old = $(this).attr('data-value');
        $('#editTodo').val(old);
        $('#editModal').modal('show');
        $('#saveBtn').click(function (e) { 
            e.preventDefault();
            var todo = $('#editTodo').val().trim();
            if(todo == ''){
                Toast.fire({
                    icon: 'warning',
                    title: 'Chưa nhập'
                });
            }
            else if(todo == old){
                Toast.fire({
                    icon: 'warning',
                    title: 'Chưa chỉnh sửa'
                });
            }
            else $.ajax({
                type: "post",
                url: "https://students.trungthanhweb.com/api/updatetodo",
                data: {
                    apitoken : localStorage.getItem('token'),
                    todo : todo,
                    id : id
                },
                dataType: "JSON",
                success: function (res) {
                    if(res.check == true){
                        Toast.fire({
                            icon: 'success',
                            title: 'Chỉnh sửa thành công'
                        }).then(() =>{
                            window.location.reload();
                        })
                    }
                    else if(res.msg.apitoken){
                        Toast.fire({
                            icon: 'error',
                            title: res.msg.apitoken
                        });
                    }
                    else if(res.msg.todo){
                        Toast.fire({
                            icon: 'error',
                            title: res.msg.todo
                        });
                    }
                    else if(res.msg.id){
                        Toast.fire({
                            icon: 'error',
                            title: res.msg.id
                        });
                    }
                }
            });
        });
    });
}