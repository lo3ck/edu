#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_worksheet.py
生成 50 道小数加减法计算题，输出为 docx 文件（A4 单页）
适合小学 4 年级（10 岁）学生练习
"""

import random
import datetime
import sys

try:
    from docx import Document
    from docx.shared import Pt, Mm
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement
except ImportError:
    print("请先安装 python-docx：pip install python-docx")
    sys.exit(1)


# ──────────────────────────── XML 辅助 ────────────────────────────

def _remove_table_borders(table):
    """去掉表格所有可见边框"""
    tbl = table._tbl
    tblPr = tbl.find(qn('w:tblPr'))
    if tblPr is None:
        tblPr = OxmlElement('w:tblPr')
        tbl.insert(0, tblPr)
    for old in tblPr.findall(qn('w:tblBorders')):
        tblPr.remove(old)
    tblBorders = OxmlElement('w:tblBorders')
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        el = OxmlElement(f'w:{edge}')
        el.set(qn('w:val'), 'none')
        el.set(qn('w:sz'), '0')
        el.set(qn('w:space'), '0')
        el.set(qn('w:color'), 'auto')
        tblBorders.append(el)
    tblPr.append(tblBorders)


def _set_row_height(row, mm: float):
    """精确锁定行高（单位：毫米）"""
    tr = row._tr
    trPr = tr.find(qn('w:trPr'))
    if trPr is None:
        trPr = OxmlElement('w:trPr')
        tr.insert(0, trPr)
    for old in trPr.findall(qn('w:trHeight')):
        trPr.remove(old)
    trHeight = OxmlElement('w:trHeight')
    trHeight.set(qn('w:val'), str(int(mm * 56.7)))   # 1 mm ≈ 56.7 twips
    trHeight.set(qn('w:hRule'), 'exact')
    trPr.append(trHeight)


def _fmt(n: float) -> str:
    """把浮点数格式化为最简小数字符串，至少保留 1 位小数"""
    s = f"{n:.2f}".rstrip('0')
    if s.endswith('.'):
        s += '0'
    return s


# ──────────────────────────── 题目生成 ────────────────────────────

def _rand_decimal(max_int: int = 15) -> float:
    """随机生成一个 1~2 位小数（适合 4 年级）"""
    dps = random.choices([1, 2], weights=[55, 45])[0]
    int_part = random.randint(0, max_int)
    if dps == 1:
        frac = random.randint(1, 9)
        return round(int_part + frac / 10, 1)
    else:
        frac = random.randint(11, 99)
        while frac % 10 == 0:          # 避免末位为 0 退化成 1 位小数
            frac = random.randint(11, 99)
        return round(int_part + frac / 100, 2)


def generate_problems(n: int = 50):
    """生成 n 道小数加减法题目（尽量不重复）"""
    seen: set = set()
    problems = []
    attempts = 0
    while len(problems) < n and attempts < n * 20:
        attempts += 1
        op = random.choice(['+', '-'])
        a = _rand_decimal()
        b = _rand_decimal()
        if op == '-':
            if a < b:
                a, b = b, a
            if abs(a - b) < 0.05:      # 避免结果接近 0
                continue
        key = (a, op, b)
        if key in seen:
            continue
        seen.add(key)
        problems.append((a, op, b))
    return problems


# ──────────────────────────── 文档生成 ────────────────────────────

def build_docx(problems: list, output_path: str):
    doc = Document()

    # ── A4 页面，窄边距，最大利用空间 ──────────────────────────────
    sec = doc.sections[0]
    sec.page_height    = Mm(297)
    sec.page_width     = Mm(210)
    sec.left_margin    = Mm(15)
    sec.right_margin   = Mm(15)
    sec.top_margin     = Mm(12)
    sec.bottom_margin  = Mm(10)

    # ── 标题 ──────────────────────────────────────────────────────
    tp = doc.add_paragraph()
    tp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    tp.paragraph_format.space_before = Pt(0)
    tp.paragraph_format.space_after  = Pt(3)
    r = tp.add_run("小数加减法计算练习（50题）")
    r.bold = True
    r.font.size = Pt(16)

    # ── 姓名 / 日期 / 得分 ────────────────────────────────────────
    ip = doc.add_paragraph()
    ip.paragraph_format.space_before = Pt(0)
    ip.paragraph_format.space_after  = Pt(5)
    today = datetime.date.today().strftime('%Y年%m月%d日')
    ir = ip.add_run(f"姓名：_______________   日期：{today}   用时：_______分_______秒   得分：_______分")
    ir.font.size = Pt(10)

    # ── 题目表格：2 列 × 25 行 ────────────────────────────────────
    COLS     = 2
    ROWS     = 25
    ROW_H_MM = 9.8          # 行高（可微调）
    COL_W    = Mm(88)       # 每列 88 mm，合计 176 mm（页面可用 180 mm）

    tbl = doc.add_table(rows=ROWS, cols=COLS)
    _remove_table_borders(tbl)

    for r_idx in range(ROWS):
        row = tbl.rows[r_idx]
        _set_row_height(row, ROW_H_MM)

        for c_idx in range(COLS):
            idx  = r_idx * COLS + c_idx
            cell = row.cells[c_idx]
            cell.width = COL_W

            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after  = Pt(0)

            if idx < len(problems):
                a, op, b = problems[idx]

                # 序号（加粗）
                r_num = p.add_run(f"({idx + 1:>2})")
                r_num.bold = True
                r_num.font.size = Pt(11)

                # 算式
                expr = f"  {_fmt(a)} {op} {_fmt(b)} = "
                r_expr = p.add_run(expr)
                r_expr.font.size = Pt(11.5)

                # 答题横线
                r_ans = p.add_run("___________")
                r_ans.font.size = Pt(11)

    doc.save(output_path)


# ──────────────────────────── 主程序 ────────────────────────────

def main():
    problems = generate_problems(50)

    today       = datetime.date.today().strftime('%Y%m%d')
    output_path = f"d:/workspace/edu/小数加减法练习_{today}.docx"

    build_docx(problems, output_path)

    print(f"✓ 文件已生成：{output_path}")
    print(f"  共 {len(problems)} 道题，包含 1~2 位小数的加减法")
    print("  用 Word / WPS 打开，选 A4 纸、实际大小打印即可。")


if __name__ == "__main__":
    main()
