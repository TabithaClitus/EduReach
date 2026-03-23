import os

lesson_page_path = 'LessonPage.jsx'
data_path = 'class7_math_rational_data.txt'
jsx_path = 'class7_math_rational_jsx.txt'

with open(lesson_page_path, 'r', encoding='utf-8') as f:
    content = f.read()

with open(data_path, 'r', encoding='utf-8') as f:
    data_content = f.read()

with open(jsx_path, 'r', encoding='utf-8') as f:
    jsx_content = f.read()

# Target 1: lessonData
target_data = "const lessonData = {"
if target_data not in content:
    print("Error: Target data string not found")
    exit(1)

content = content.replace(target_data, target_data + "\n" + data_content)

# Target 2: JSX ending
target_jsx = """                )}


            </div>
        </div>

            {/* Footer */}"""

if target_jsx not in content:
    print("Error: Target jsx string not found")
    print("Ensure the indentation matches perfectly.")
    exit(1)

replacement_jsx = f"""                )}}

{jsx_content}

            </div>
        </div>

            {{/* Footer */}}"""

content = content.replace(target_jsx, replacement_jsx)

with open(lesson_page_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("Successfully injected Class 7 Mathematics - Rational Numbers lesson.")
