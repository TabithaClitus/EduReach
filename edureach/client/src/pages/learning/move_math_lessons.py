import os

lesson_page_path = 'LessonPage.jsx'

with open(lesson_page_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "                {/* CLASS 7 – MATHEMATICS – INTEGERS */}"
# The block ends with `                )}` right before `            </div>`
# Let's cleanly split content at the start marker
if start_marker not in content:
    print("Error: Start marker not found.")
    exit()

part1, part2 = content.split(start_marker, 1)

# Now we find the end of the block in part2
# It's right before:
#             </div>
#         </div>
# 
#             {/* Footer */}
end_anchor = "            </div>\n        </div>\n\n            {/* Footer */}"

if end_anchor not in part2:
    print("Error: end anchor not found")
    exit()

block_to_move, end_part = part2.split(end_anchor, 1)

# So the full block is start_marker + block_to_move
full_block = start_marker + block_to_move

# Now remove the block from the bottom
new_content_without_block = part1 + end_anchor + end_part

# Now we need to insert `full_block` right above:
#                 {/* ──────────── 6. VIDEO ──────────── */}
insert_target = "                {/* ──────────── 6. VIDEO ──────────── */}"

if insert_target not in new_content_without_block:
    print("Error: insert target not found")
    exit()

final_content = new_content_without_block.replace(insert_target, full_block + insert_target)

with open(lesson_page_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(final_content)

print("Successfully moved Class 7 Math lessons to the correct JSX position.")
