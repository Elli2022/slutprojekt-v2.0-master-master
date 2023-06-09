import { elements} from './domElements';
import { UserInfo } from './interfaces';
import {  getUsers, saveUser, getCurrentUser, deleteUser, getUserByUsername  } from './api';
import { getLoggedInUser as loggedInUser } from './api';



async function createUser() {
    const userName = elements.usernameInput!.value.trim();
    const password = elements.passwordInput!.value.trim();
    const selectedImage = elements.imageSelection!.value.trim();

    if (userName && password && selectedImage) {
        const users = await getUsers();
        const userExists = users.some(user => user.userName === userName);

        const newUser: UserInfo = {
            userName: userName,
            password: password,
            status: "",
            imageurl: selectedImage,
            newUser: true, // Set newUser to true when creating a new account
            statusUpdates: [],
        };
        

        try {
            await saveUser(newUser);
            elements.accountCreated.innerHTML = "Account Created!";
            elements.body.appendChild(elements.accountCreated);
            setTimeout(() => {
                elements.accountCreated.remove();
            }, 3000);
        } catch (err) {
            console.log(err);
            elements.errorMessage.innerHTML = "Failed to create account. Try again.";
            elements.body.appendChild(elements.errorMessage);
            setTimeout(() => {
                elements.errorMessage.remove();
            }, 3000);
        }
    } else {
        elements.errorMessage.innerHTML = "Please fill in all fields.";
        elements.body.appendChild(elements.errorMessage);
        setTimeout(() => {
            elements.errorMessage.remove();
        }, 3000);
    }
}



async function loginUser() {
    const userName = elements.usernameInput!.value.trim();
    const password = elements.passwordInput!.value.trim();
  
    if (userName && password) {
      try {
        const users = await getUsers();
        const foundUser = users.find((user) => user.userName === userName && user.password === password);
  
        if (foundUser) {
          foundUser.newUser = false; // Set newUser to false when user logs in
          foundUser.status = "logged-in"; // Set the user's status to "logged-in"
          await saveUser(foundUser);
          localStorage.setItem("loggedInUser", foundUser.userName);
  
          elements.logInpage.style.display = "none";
          elements.container.style.display = "block";
  
          if (elements.currentUser) {
            elements.currentUser.textContent = `Logged in as: ${foundUser.userName}`;
          } else {
            console.error('elements.currentUser is null');
          }
  
          displayStatusUpdates();
          displayLoggedInUsers();
          displayUserStatus();
  
          const loggedInUserHeader = document.getElementById("loggedInUserHeader");
          loggedInUserHeader!.textContent = `Logged in as: ${foundUser.userName}`;
        } else {
          elements.errorMessage.innerHTML = "Incorrect username or password. Try again.";
          elements.body.appendChild(elements.errorMessage);
          setTimeout(() => {
            elements.errorMessage.remove();
          }, 3000);
        }
      } catch (err) {
        console.log(err);
        elements.errorMessage.innerHTML = "Failed to log in. Try again.";
        elements.body.appendChild(elements.errorMessage);
        setTimeout(() => {
          elements.errorMessage.remove();
        }, 3000);
      }
    } else {
      elements.errorMessage.innerHTML = "Please enter a username and password.";
      elements.body.appendChild(elements.errorMessage);
      setTimeout(() => {
        elements.errorMessage.remove();
      }, 3000);
    }
  }
  
  async function displayUserStatus() {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      elements.userStatus!.textContent = `${currentUser.userName}'s status: ${currentUser.status}`;
    }
  }

  async function addStatusUpdate() {
    const newStatus = elements.statusInput!.value.trim();
  
    if (newStatus) {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          // Check if statusUpdates exists, otherwise create an empty array
          if (!currentUser.statusUpdates) {
            currentUser.statusUpdates = [];
          }
          currentUser.statusUpdates.push(newStatus);
          await saveUser(currentUser);
          elements.statusInput!.value = "";
          displayStatusUpdates();
          displayAllUsers(); // Add this line to update the user list after adding a new status
        } else {
          elements.errorMessage.innerHTML = "Failed to find the current user.";
          elements.body.appendChild(elements.errorMessage);
          setTimeout(() => {
            elements.errorMessage.remove();
          }, 3000);
        }
      } catch (err) {
        console.log(err);
        elements.errorMessage.innerHTML = "Failed to update status. Try again.";
        elements.body.appendChild(elements.errorMessage);
        setTimeout(() => {
          elements.errorMessage.remove();
        }, 3000);
      }
    } else {
      elements.errorMessage.innerHTML = "Please enter a status update.";
      elements.body.appendChild(elements.errorMessage);
      setTimeout(() => {
        elements.errorMessage.remove();
      }, 3000);
    }
  }
  
  
  
  
  
  
  

  async function displayStatusUpdates() {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const latestStatus = currentUser.statusUpdates ? currentUser.statusUpdates.slice(-1)[0] || '' : '';
  
      // Update the loggedInUserHeader with the current user's latest status update
      const loggedInUserHeader = document.getElementById("loggedInUserHeader");
      if (loggedInUserHeader) {
        loggedInUserHeader.textContent = `Logged in as: ${currentUser.userName} - Status: ${latestStatus}`;
      } else {
        console.error("loggedInUserHeader element not found");
      }
    }
  }
  
  
  async function displayLoggedInUsers() {
    const users = await getUsers();
    const currentUser = await getCurrentUser();

    users.forEach(user => {
        const li = document.createElement("li");
        li.textContent = `${user.userName}:`;

        // Check that the element exists before appending the child element
        if (elements.loggedInUsersList) {
            elements.loggedInUsersList.appendChild(li);
        }
    });
}


  
  async function visitOtherUserPage(username: string): Promise<void> {
    const user = await getUserByUsername(username);
    if (!user) {
      throw new Error("User not found.");
    }
    elements.loggedInUsersPage!.style.display = "none";
    elements.otherUserPage!.style.display = "block";
    elements.otherUserPage!.querySelector(".username")!.textContent = user.userName;
    elements.otherUserPage!.querySelector(".profile-pic")!.setAttribute("src", user.profilePictureUrl);
  }
  
  async function displayAllUsers() {
    try {
      const allUsers = await getUsers();
      const userList = document.createElement("ul");
      allUsers.forEach((user) => {
        const listItem = document.createElement("li");
        const latestStatus = user.statusUpdates ? user.statusUpdates.slice(-1)[0] || '' : '';
        listItem.textContent = `${user.userName} - Last status: ${latestStatus}`;
        listItem.addEventListener("click", () => {
          visitOtherUserPage(user.userName);
        });
        userList.appendChild(listItem);
      });
      if (elements.allUsersList) {
        elements.allUsersList.innerHTML = "";
        elements.allUsersList.appendChild(userList);
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  
  

async function deleteCurrentUser() {
    const userName = elements.usernameInput!.value.trim();
    const password = elements.passwordInput!.value.trim();

    if (userName && password) {
        try {
            const users = await getUsers();

            const foundUser = users.find((user) => user.userName === userName && user.password === password);

            if (foundUser) {
              await deleteUser(foundUser.userName);
              localStorage.removeItem("loggedInUser");
                elements.userDeletedSuccessfully.innerHTML = "User deleted successfully!";
                elements.body.appendChild(elements.userDeletedSuccessfully);
                setTimeout(() => {
                    elements.userDeletedSuccessfully.remove();
                }, 3000);

                // Reset the input fields and navigate back to the login page
                elements.usernameInput!.value = '';
                elements.passwordInput!.value = '';
                elements.container.style.display = "none";
                elements.logInpage.style.display = "block";
            } else {
                elements.failedToDeleteUser.innerHTML = "Failed to delete user. Incorrect username or password.";
                elements.body.appendChild(elements.failedToDeleteUser);
                setTimeout(() => {
                    elements.failedToDeleteUser.remove();
                }, 3000);
            }
        } catch (err) {
            console.log(err);
            elements.failedToDeleteUser.innerHTML = "Failed to delete user. Try again.";
            elements.body.appendChild(elements.failedToDeleteUser);
            setTimeout(() => {
                elements.failedToDeleteUser.remove();
            }, 3000);
        }
    } else {
        elements.errorMessage.innerHTML = "Please enter a username and password.";
        elements.body.appendChild(elements.errorMessage);
        setTimeout(() => {
            elements.errorMessage.remove();
        }, 3000);
    }
}




function setupEventListeners() {
    console.log("Create Account Button: ", elements.createAccountButton);
    console.log("Submit Button: ", elements.submitButton);
    console.log("Delete Account Button: ", elements.deleteAccountButton);
    console.log("Submit Status: ", elements.submitStatus);

    elements.createAccountButton!.addEventListener("click", () => {
        createUser();
    });

    elements.submitButton!.addEventListener("click", (event) => {
        event.preventDefault();
        loginUser();
    });

    elements.deleteAccountButton!.addEventListener("click", () => {
        deleteCurrentUser();
    });

    elements.submitStatus!.addEventListener("click", (event) => {
        event.preventDefault();
        addStatusUpdate();
    });
}



async function init() {
    document.addEventListener('DOMContentLoaded', async () => {
        setupEventListeners();
        await displayAllUsers(); 
    });
}

init();

