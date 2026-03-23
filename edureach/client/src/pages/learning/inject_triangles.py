import os

lesson_page_path = 'LessonPage.jsx'

with open('class7_math_triangles_data.txt', 'r', encoding='utf-8') as f:
    tri_data = f.read()

with open('class7_math_triangles_jsx.txt', 'r', encoding='utf-8') as f:
    tri_jsx = f.read()

with open(lesson_page_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject Data target
target_data = "const lessonData = {"
if target_data not in content:
    print("Error: Target data string not found")
    exit(1)

content = content.replace(target_data, target_data + "\n" + tri_data + ",")

# 2. Inject JSX target before VIDEO block
target_jsx = "                {/* ──────────── 6. VIDEO ──────────── */}"

if target_jsx not in content:
    print("Error: Target JSX string not found")
    exit(1)

expanded_jsx = tri_jsx + "\n\n" + target_jsx
content = content.replace(target_jsx, expanded_jsx)

with open(lesson_page_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("Successfully injected Class 7 Mathematics - Triangles lesson.")
