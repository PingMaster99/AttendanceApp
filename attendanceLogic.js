document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.firestore()
    let logged_in = false
    let selected_assisted = true
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.firestore().doc('/foo/bar').get().then(() => { });
    // firebase.functions().httpsCallable('yourFunction')().then(() => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    // firebase.analytics(); // call to activate
    // firebase.analytics().logEvent('tutorial_completed');
    // firebase.performance(); // call to activate
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    try {
        let app = firebase.app();
        console.log('firebase has started', app)

        window.googleLogin = () => {
            const provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithPopup(provider).then(response => {
                console.log(response)
            })
        }

        firebase.auth().onAuthStateChanged(function(user) {
            if(user){

                db.collection('students').onSnapshot(snapshot => {
                    let changes = snapshot.docChanges()
                    changes.forEach(change => {
                        if(change.type === 'added') {
                            const student = change.doc
                            document.getElementById('student_list').innerHTML += (
                                `<li onclick="assisted('${student.id}')" id="${student.id}" value="${student.data().assisted}"> 
                                    <button onclick="deleteStudent('${student.id}')" class="delete_button">&times</button> ${student.id} ${student.data().name} ${student.data().assisted ? '&check;' : '&times;'}
                                </li>`)
                        } else if (change.type === 'removed') {
                            let li = document.getElementById(change.doc.id.toString())
                            li.remove()
                        } else if (change.type === 'modified') {
                            console.log("MODIFIEEEDDDDDDDDD")
                            let li = document.getElementById(change.doc.id.toString())
                            li.innerHTML = `<button onclick="deleteStudent('${change.doc.id}')" class="delete_button">&times</button> ${change.doc.id} ${change.doc.data().name} ${change.doc.data().assisted ? '&check;' : '&times;'}`
                            console.log("assisted", change.doc.data().assisted, li.value)
                        }
                    })
                })


                window.assisted = (id) => {
                    const came = document.getElementById(`${id}`)
                    let came_value = came.value
                    console.log(came_value)
                    came_value = came_value === 0;

                    console.log("HI, editing", id, "ASSISTED", came_value)
                    came.value = !came.value
                    db.collection('students').doc(id).update({assisted: came_value})
                }

                window.deleteStudent = (id) => {
                    try {
                        db.collection('students').doc(id).delete()
                        console.log('deleted', id)
                    } catch {
                        // Already deleted
                    }

                }

                document.body.innerHTML += (`           
                <div class="student_elements">
                    <button onclick="logOff()" class="logOutButton">Cerrar sesión</button>
                    <h2>Listado</h2>
                    <ul id="student_list">
                    </ul>
                    
                    <div class="addition">
                        <h2>Agregar Estudiante</h2>
                        <h3>Carnet</h3>
                        <input type="number" name="Carnet" id="carnet"/>
                        <h3>Nombre</h3>
                        <input type="text" name="Nombre del Estudiante" id="nombre_estudiante"/>
                        <button id="upload_student" onclick="addStudent()">Agregar</button>
                    </div>
                </div>
                `)

                try{
                    document.getElementById('message').remove()
                } catch (e) {
                    // Already been removed
                }

                console.log('loggedin!')


            } else {
                console.log('not li')
            }

            window.logOff = () => {
                firebase.auth().signOut()
                document.location.reload()
            }

            window.addStudent = () => {
                const id = document.getElementById('carnet').value
                const name = document.getElementById('nombre_estudiante').value

                if (id.length !== 0 || name.length !== 0) {
                    db.collection('students').doc(id).set({
                        name: name,
                    })

                    document.getElementById('carnet').value = ''
                    document.getElementById('nombre_estudiante').value = ''
                }
            }
        })



    } catch (e) {
        console.error(e);
        loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
    }


});
