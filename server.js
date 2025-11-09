// โหลดไลบรารีที่จำเป็น
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// กำหนดให้ Express เสิร์ฟไฟล์จากโฟลเดอร์ 'public'
// (นี่คือที่ที่เราจะเก็บ index.html และ client.js)
app.use(express.static('public'));

// เมื่อมีคนเชื่อมต่อเข้ามา (เปิดเว็บ)
io.on('connection', (socket) => {
    console.log(`มีคนเชื่อมต่อเข้ามา: ${socket.id}`);

    // เมื่อ Client ร้องขอ "joinRoom" (ส่งชื่อห้องมา)
    socket.on('joinRoom', (roomName) => {
        socket.join(roomName); // สั่งให้ socket นี้เข้าร่วมห้อง
        console.log(`ผู้ใช้ ${socket.id} เข้าร่วมห้อง ${roomName}`);
        
        // ส่งข้อความไป "ในห้องนั้นๆ" (เฉพาะห้องที่เพิ่งเข้า)
        // เพื่อบอกทุกคนว่ามีคนใหม่เข้ามา
        io.to(roomName).emit('message', `ผู้ใช้ ${socket.id} ได้เข้าร่วมห้อง ${roomName} แล้ว`);
    });

    // เมื่อ Client ส่ง "chatMessage" (ส่งข้อความแชท)
    socket.on('chatMessage', (data) => {
        // data จะมี { room: '...', msg: '...' }
        // ส่งข้อความไปยังทุกคนในห้องที่ระบุ
        io.to(data.room).emit('message', `[${data.room}] ${socket.id}: ${data.msg}`);
    });

    // เมื่อคนหลุดการเชื่อมต่อ (ปิดแท็บ)
    socket.on('disconnect', () => {
        console.log(`มีคนตัดการเชื่อมต่อ: ${socket.id}`);
        // (ในแอปจริง เราควรแจ้งห้องที่เขาอยู่ด้วยว่าเขาออกไปแล้ว)
    });
});

// รันเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`เซิร์ฟเวอร์กำลังรันที่ http://localhost:${PORT}`);
});
