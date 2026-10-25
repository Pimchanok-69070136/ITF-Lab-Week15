/**
 * To-do List Script (เวอร์ชันแก้ไขให้ลบรายการเดิมได้)
 * - เพิ่มรายการจากช่อง input
 * - ลบรายการได้ทั้งรายการเดิมใน HTML และรายการที่เพิ่มใหม่
 * - บันทึกข้อมูลลง localStorage (ไม่หายเมื่อ refresh)
 * อ้างอิง id จาก index.html เดิม โดยไม่แก้ไขดีไซน์
 */

// อ้างอิง element จาก HTML
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// คีย์สำหรับเก็บข้อมูลใน localStorage
const STORAGE_KEY = 'todoListItems';

/* ------------------------------------------------------------------ */
/* ฟังก์ชันหลัก                                                       */
/* ------------------------------------------------------------------ */

/**
 * สร้าง element <li> ของรายการ to-do
 * @param {string} text ข้อความรายการ
 * @param {string} id รหัสเฉพาะของรายการ
 */
function createTodoElement(text, id) {
  const li = document.createElement('li');
  li.setAttribute('data-id', id);

  // ข้อความรายการ
  const span = document.createElement('span');
  span.textContent = text;

  // ปุ่มลบ
  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.textContent = 'ลบ';

  li.appendChild(span);
  li.appendChild(delBtn);
  todoList.appendChild(li);
}

/**
 * อ่านรายการทั้งหมดจาก #todo-list แล้วบันทึกลง localStorage
 */
function saveTodos() {
  const items = [];
  document.querySelectorAll('#todo-list li').forEach((li) => {
    items.push({
      id: li.getAttribute('data-id') || String(Date.now() + Math.random()),
      text: li.querySelector('span').textContent,
    });
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/**
 * เพิ่มรายการใหม่
 */
function addTodo() {
  const text = todoInput.value.trim();

  // ถ้าช่องว่างให้ไม่ทำอะไร
  if (text === '') {
    return;
  }

  const id = Date.now().toString();
  createTodoElement(text, id);
  saveTodos();

  // เคลียร์ช่อง input และโฟกัสกลับ
  todoInput.value = '';
  todoInput.focus();
}

/**
 * ลบรายการตาม id
 * @param {string} id
 */
function deleteTodo(id) {
  const li = document.querySelector(`#todo-list li[data-id="${id}"]`);
  if (li) {
    li.remove();
    saveTodos();
  }
}

/**
 * โหลดรายการเก่าจาก localStorage กลับมาแสดงเมื่อเปิดหน้าเว็บ
 * ถ้ายังไม่มีข้อมูลเก่า ให้ใส่ data-id กับรายการต้นฉบับใน HTML
 * เพื่อให้ปุ่มลบของรายการเดิมทำงานได้
 */
function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    // ถ้ามีข้อมูลเก่าใน localStorage ให้เคลียร์ลิสต์เดิมใน HTML ออกก่อน
    todoList.innerHTML = '';
    const items = JSON.parse(stored);
    items.forEach((item) => {
      createTodoElement(item.text, item.id);
    });
  } else {
    // ใส่ data-id ให้รายการต้นฉบับใน HTML ที่ยังไม่มี
    // เพื่อให้ระบุตัวตนและลบได้เมื่อกดปุ่มลบ
    document.querySelectorAll('#todo-list li').forEach((li) => {
      if (!li.getAttribute('data-id')) {
        li.setAttribute('data-id', Date.now().toString() + Math.random());
      }
    });
  }
}

/* ------------------------------------------------------------------ */
/* Event Listeners                                                    */
/* ------------------------------------------------------------------ */

/**
 * ใช้ event delegation จัดการการคลิกปุ่มลบทั้งหมด
 * รองรับทั้งปุ่มลบของรายการเดิมใน HTML และรายการที่เพิ่มใหม่
 */
todoList.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const li = button.closest('li');
  if (!li) return;

  const id = li.getAttribute('data-id');
  if (id) {
    deleteTodo(id);
  }
});

// กดปุ่ม "+ เพิ่ม"
addBtn.addEventListener('click', addTodo);

// กด Enter ในช่อง input ก็เพิ่มรายการได้
todoInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
});

// เมื่อหน้าเว็บโหลดเสร็จ ให้ดึงข้อมูลจาก localStorage กลับมาแสดง
document.addEventListener('DOMContentLoaded', loadTodos);
