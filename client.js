// เชื่อมต่อ Socket.io ไปยังเซิร์ฟเวอร์ (ที่รันเครื่องเราอยู่)
const socket = io();

// ดึงองค์ประกอบ HTML มาเก็บในตัวแปร
const roomContainer = document.getElementById('roomContainer');
const chatContainer = document.getElementById('chatContainer');
const roomNameInput = document.getElementById('roomName');
const joinButton = document.getElementById('joinButton');
const currentRoom = document.getElementById('currentRoom');

const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

let joinedRoom = ''; // ตัวแปรไว้เก็บชื่อห้องที่เราเข้า

// --- การจัดการการเข้าร่วมห้อง ---
joinButton.addEventListener('click', () => {
    const roomName = roomNameInput.value.trim();
    if (roomName) {
        joinedRoom = roomName; // เก็บชื่อห้อง
        
        // ส่ง Event 'joinRoom' ไปยังเซิร์ฟเวอร์ พร้อมชื่อห้อง
        socket.emit('joinRoom', joinedRoom);
        
        // สลับหน้าจอ: ซ่อนส่วนเข้าร่วม, แสดงส่วนแชท
        roomContainer.style.display = 'none';
        chatContainer.style.display = 'block';
        currentRoom.textContent = joinedRoom;
    }
});

// --- การจัดการการส่งข้อความ ---
sendButton.addEventListener('click', () => {
    const msg = messageInput.value.trim();
    if (msg && joinedRoom) {
        // ส่ง Event 'chatMessage' ไปยังเซิร์ฟเวอร์
        // พร้อมข้อมูล (ชื่อห้อง และ ข้อความ)
        socket.emit('chatMessage', { 
            room: joinedRoom, 
            msg: msg 
        });
        messageInput.value = ''; // เคลียร์ช่อง input
    }
});

// --- การรับข้อความจากเซิร์ฟเวอร์ ---
// เมื่อได้รับ Event 'message' จากเซิร์ฟเวอร์
socket.on('message', (msg) => {
    // สร้าง <div> ใหม่สำหรับข้อความ
    const item = document.createElement('div');
    item.textContent = msg;
    
    // เพิ่มข้อความลงในกล่องแชท
    messages.appendChild(item);
    
    // เลื่อนกล่องแชทลงล่างสุด
    messages.scrollTop = messages.scrollHeight;
});
