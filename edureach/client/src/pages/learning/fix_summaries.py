import os

lesson_page_path = 'LessonPage.jsx'

with open(lesson_page_path, 'r', encoding='utf-8') as f:
    content = f.read()

summary_block = """        summary: [
            "You have learned the core concepts of this topic.",
            "You practiced solving various mathematical problems and quizzes.",
            "You explored real-world applications of these principles."
        ],
        summaryEnd: "Great job completing this lesson!",
"""

replacements = {
    "        nextLesson: { id: 'fractions-decimals', title: 'Fractions & Decimals' }": 
        summary_block + "        nextLesson: { id: 'fractions-decimals', title: 'Fractions & Decimals' }",
        
    "        nextLesson: { id: 'rational-numbers', title: 'Rational Numbers' }": 
        summary_block + "        nextLesson: { id: 'rational-numbers', title: 'Rational Numbers' }",
        
    "        nextLesson: { id: 'algebra', title: 'Algebra (Equations + Expressions)' }": 
        summary_block + "        nextLesson: { id: 'algebra', title: 'Algebra (Equations + Expressions)' }"
}

for old, new in replacements.items():
    if old in content:
        content = content.replace(old, new)
        print(f"Replaced block for {old.strip()}")
    else:
        print(f"WARNING: target string not found: {old.strip()}")

with open(lesson_page_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("Finished applying summary fixes.")
