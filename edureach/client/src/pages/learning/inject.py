import os

lesson_page_path = 'LessonPage.jsx'
temp1_path = 'temp_lessons_1.jsx'
temp2_path = 'temp_lessons_2.jsx'

with open(lesson_page_path, 'r', encoding='utf-8') as f:
    lesson_content = f.read()

with open(temp1_path, 'r', encoding='utf-8') as f:
    t1 = f.read()

with open(temp2_path, 'r', encoding='utf-8') as f:
    t2 = f.read()

target_str = "                {/* CLASS 6 – ENGLISH – POETRY */}"

if target_str not in lesson_content:
    print("Target string not found!")
    exit(1)

new_content = lesson_content.replace(target_str, t1 + "\n" + t2 + "\n\n" + target_str)

with open(lesson_page_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(new_content)

print("Successfully injected all 6 lessons.")
