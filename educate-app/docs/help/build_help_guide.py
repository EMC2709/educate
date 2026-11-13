"""Builds Educate-Help-Guide.pdf (the student and parent help guide).

Run from this folder:  python build_help_guide.py
Needs: pip install reportlab

The wording of every button and page name below was checked against the app's
code on 13 Nov 2026. If a label changes in the app, change it here and rebuild.
"""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate, Frame, KeepTogether, ListFlowable, ListItem, PageBreak,
    PageTemplate, Paragraph, Spacer, Table, TableStyle,
)

OUT = Path(__file__).with_name("Educate-Help-Guide.pdf")
SITE = "educate-virid.vercel.app"

INDIGO = colors.HexColor("#4f46e5")
INK = colors.HexColor("#1f2937")
MUTED = colors.HexColor("#6b7280")
TIP_BG = colors.HexColor("#eef2ff")
WARN_BG = colors.HexColor("#fff7ed")
WARN_EDGE = colors.HexColor("#f59e0b")
GREEN = colors.HexColor("#10b981")

base = getSampleStyleSheet()
S = {
    "body": ParagraphStyle("body", parent=base["Normal"], fontName="Helvetica", fontSize=11, leading=16, textColor=INK, spaceAfter=6),
    "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=20, leading=25, textColor=INDIGO, spaceBefore=18, spaceAfter=10, keepWithNext=1),
    "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=13.5, leading=18, textColor=INK, spaceBefore=10, spaceAfter=5, keepWithNext=1),
    "step": ParagraphStyle("step", fontName="Helvetica", fontSize=11, leading=16, textColor=INK),
    "box": ParagraphStyle("box", fontName="Helvetica", fontSize=10.5, leading=15, textColor=INK),
    "toc": ParagraphStyle("toc", fontName="Helvetica", fontSize=12, leading=21, textColor=INK),
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=38, leading=44, textColor=INDIGO, alignment=TA_CENTER),
    "subtitle": ParagraphStyle("subtitle", fontName="Helvetica", fontSize=16, leading=22, textColor=INK, alignment=TA_CENTER),
    "small": ParagraphStyle("small", fontName="Helvetica", fontSize=10, leading=14, textColor=MUTED, alignment=TA_CENTER),
    "q": ParagraphStyle("q", fontName="Helvetica-Bold", fontSize=11.5, leading=16, textColor=INK, spaceBefore=9, spaceAfter=2),
}


def p(text, style="body"):
    return Paragraph(text, S[style])


def steps(items):
    return ListFlowable(
        [ListItem(Paragraph(t, S["step"]), leftIndent=18, spaceAfter=3) for t in items],
        bulletType="1", bulletFontName="Helvetica-Bold", bulletFontSize=11, bulletColor=INDIGO, leftIndent=18,
    )


def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(t, S["step"]), leftIndent=16, spaceAfter=2) for t in items],
        bulletType="bullet", bulletFontName="Helvetica", bulletFontSize=11, bulletColor=INDIGO, leftIndent=16, start="•",
    )


def box(label, text, warn=False):
    t = Table([[Paragraph(f"<b>{label}</b>&nbsp;&nbsp;{text}", S["box"])]], colWidths=[166 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), WARN_BG if warn else TIP_BG),
        ("LINEBEFORE", (0, 0), (0, -1), 3, WARN_EDGE if warn else INDIGO),
        ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 7), ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return KeepTogether([Spacer(1, 4), t, Spacer(1, 8)])


def tip(text):
    return box("Tip:", text)


def note(text):
    return box("Good to know:", text, warn=True)


def footer(canvas, doc):
    if doc.page == 1:
        return
    canvas.saveState()
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(MUTED)
    canvas.drawString(22 * mm, 12 * mm, "Educate help guide")
    canvas.drawRightString(A4[0] - 22 * mm, 12 * mm, f"Page {doc.page}")
    canvas.restoreState()


SECTIONS = [
    "What Educate is",
    "Signing in",
    "Choosing your exam board and subject",
    "Quizzes",
    "Past papers",
    "The mark scheme and AI marking",
    "Free practice (including 11+)",
    "Other things you can do",
    "Phones, tablets and Chromebooks",
    "Staying safe and playing fair",
    "Help! Something isn't working",
]

story = []

# ── Title page ───────────────────────────────────────────────────────────────
story += [
    Spacer(1, 62 * mm),
    p("Educate", "title"),
    Spacer(1, 6 * mm),
    p("Help guide for students and parents", "subtitle"),
    Spacer(1, 10 * mm),
    p("GCSE revision: quizzes, real past papers, mark schemes and an AI tutor", "small"),
    Spacer(1, 70 * mm),
    p(f"Website: {SITE}", "small"),
    p("Guide version: 13 November 2026", "small"),
    PageBreak(),
]

# ── Contents ─────────────────────────────────────────────────────────────────
story.append(p("What's in this guide", "h1"))
for i, name in enumerate(SECTIONS, 1):
    story.append(p(f"<font color='#4f46e5'><b>{i}.</b></font>&nbsp;&nbsp;{name}", "toc"))
story.append(Spacer(1, 8))
story.append(tip("In a hurry? Read section 5 (Past papers) and section 6 (The mark scheme and AI marking). They cover the main things most students use."))
story.append(PageBreak())

n = 0


def section(title):
    global n
    n += 1
    return p(f"{n}. {title}", "h1")


# 1 ───────────────────────────────────────────────────────────────────────────
story += [
    section("What Educate is"),
    p("Educate is a website that helps you revise for your GCSEs. You use it in a web browser on a laptop, Chromebook, tablet or phone. There is nothing to install."),
    p("With Educate you can:"),
    bullets([
        "do <b>quizzes</b> on the topics you choose",
        "practise <b>real past exam papers</b> and type your answers on screen",
        "see the <b>official mark scheme</b> next to your answers",
        "ask the <b>AI to mark</b> your answers against that mark scheme",
        "ask the <b>AI Tutor</b> to explain something you are stuck on",
        "make flashcards, plan a revision timetable and track your progress",
    ]),
    note("You can try quizzes without an account. To use real past papers, mark schemes, AI marking and the AI Tutor you need to <b>sign in</b>."),
    p("How to open Educate", "h2"),
    steps([
        f"Open your web browser (Chrome works best).",
        f"Type <b>{SITE}</b> in the address bar and press Enter.",
    ]),
]

# 2 ───────────────────────────────────────────────────────────────────────────
story += [
    section("Signing in"),
    steps([
        "Press <b>Sign in</b> at the top right of the page.",
        "Type your email address, or choose <b>Continue with Google</b>.",
        "Type your password and press <b>Continue</b>.",
        "The first time you use a new device, Educate emails you a <b>6-digit code</b>. Open your email, find the code and type it in.",
    ]),
    tip(f"If a link takes you to a page that says the page can't be found, go to <b>{SITE}/login</b> to sign in."),
    note("The code is only asked for on a device Educate hasn't seen before. It keeps your account safe. It is not an error."),
    p("Signing out", "h2"),
    p("Press your picture (the round button at the top right), then choose to sign out. Always sign out on a shared or school computer."),
]

# 3 ───────────────────────────────────────────────────────────────────────────
story += [
    section("Choosing your exam board and subject"),
    p("Your exam board is the organisation that sets your exams. Your teacher can tell you which one you use for each subject. The four boards on Educate are AQA, Edexcel, OCR and WJEC."),
    steps([
        "On the home page, choose your <b>exam board</b>.",
        "Choose your <b>subject</b>, for example Mathematics.",
        "You now see the page for that subject. From here you can start a quiz or open <b>Official Past Papers</b>.",
    ]),
    note("Real past papers and mark schemes work best for <b>AQA</b> at the moment. There are no Edexcel papers on Educate yet, so Edexcel students get sample questions instead."),
]

# 4 ───────────────────────────────────────────────────────────────────────────
story += [
    section("Quizzes"),
    p("A quiz gives you a set of questions on the topics you pick. Quizzes work even if you are not signed in."),
    steps([
        "Open your subject and go to the topics page.",
        "<b>Tick the topics</b> you want. Press the small arrow beside a topic to see its smaller parts and tick just those. <b>Select All</b> ticks everything and <b>Clear</b> unticks everything.",
        "Choose the kind of questions you want: <b>Short Answer</b>, <b>Multiple Choice</b>, <b>Flashcards</b> or <b>Past Paper</b>.",
        "Press the <b>Start</b> button.",
        "Type your answer and press <b>Check Answer</b>.",
        "Read the feedback, then press <b>Next Question</b>.",
    ]),
    tip("If you are signed in, the AI reads your answer and understands different ways of saying the same thing. If you are not signed in, marking is simpler and can be too generous or too harsh."),
    note("If the page says it could not mark your answer, that answer has <b>not</b> been counted as wrong. Just try again."),
]

# 5 ───────────────────────────────────────────────────────────────────────────
story += [
    section("Past papers"),
    p("This is the most useful part of Educate. You answer a real exam paper on screen, then check your answers against the official mark scheme. You need to be signed in."),
    p("Step 1: Pick your paper", "h2"),
    steps([
        "Open your subject and press <b>Official Past Papers</b>.",
        "Choose the paper: <b>Paper 1</b>, <b>Paper 2</b> or <b>Paper 3</b>.",
        "If your subject has tiers, choose <b>Higher</b> or <b>Foundation</b>.",
        "Under <b>Select Year</b>, choose a year.",
    ]),
    box("The green dot:", "A year with a <font color='#10b981'><b>green dot</b></font> can be practised on Educate. A year without a dot can only be downloaded."),
    p("Under the years you will see up to three buttons:"),
    bullets([
        "<b>Download Paper</b> and <b>Download Mark Scheme</b> open the official files from the exam board. For some subjects these say <b>Find Paper on AQA</b> instead, and take you to the board's website.",
        "<b>Practise on Educate</b> opens the paper so you can answer it on screen.",
    ]),
    note("If a paper is not on Educate, the page tells you so, for example: \"The 2024 Paper 1 isn't on Educate yet.\" You may be offered <b>Practise a different paper instead</b>. That is a real paper for the same subject, but not the year you picked."),
    p("Step 2: Start", "h2"),
    steps([
        "Press <b>Practise on Educate</b>.",
        "Check the number of questions, the marks and the time allowed.",
        "Press <b>Start Paper</b>. The clock at the top starts counting.",
    ]),
    p("Step 3: Answer the questions", "h2"),
    bullets([
        "<b>Written answers:</b> click in the lined box under the question and type.",
        "<b>Multiple choice:</b> click the answer you think is right. Click a different one to change it.",
        "<b>Drawing questions:</b> draw in the box with your mouse or finger. If you would rather type, press <b>Type your answer instead of drawing</b>.",
        "If a question is shown as multiple choice but it isn't one, press <b>Not a multiple-choice question? Type your answer instead</b>.",
        "Stuck? Press <b>Show hint</b> under the question.",
    ]),
    p("Seeing the original paper (for diagrams and graphs)", "h2"),
    p("The questions on screen are text only. When a question mentions a figure, diagram, graph or table, look at the original paper:"),
    bullets([
        "Press <b>PDF Figures</b> at the top. The real paper opens at the side of the screen.",
        "Or use the <b>Paper pages</b> row of small pictures near the top of the paper. Click a page to make it bigger.",
    ]),
    tip("Some question text has odd bits in it, such as \"Turn over\" or \"*05*\". These come from the printed paper. Ignore them."),
    p("Your answers are saved as you type", "h2"),
    p("Educate saves your answers in the browser tab as you type. If you refresh the page by mistake, press <b>Start Paper</b> again and your answers come back. Your browser also warns you before you close the tab in the middle of a paper."),
    note("Answers are saved in <b>that tab only</b>. If you close the tab, or switch to a different device, you start again with a blank paper."),
    p("Step 4: Finish", "h2"),
    steps([
        "Press <b>Finish &amp; review</b> at the top (or the button at the bottom of the paper).",
        "If you left questions blank, Educate asks <b>Finish the paper?</b> Press <b>Keep working</b> to go back, or <b>Finish anyway</b>.",
        "You now see all your answers on one page.",
    ]),
    p("From the answers page you can press <b>Back to my answers</b> to carry on with the paper, <b>Start again</b> to clear everything (you have to press it twice, so you can't do it by accident), or <b>Back to papers</b> to pick another paper."),
]

# 6 ───────────────────────────────────────────────────────────────────────────
story += [
    section("The mark scheme and AI marking"),
    p("The official mark scheme", "h2"),
    p("When you finish a paper, Educate looks for the exam board's official mark scheme for that exact paper."),
    bullets([
        "On a laptop or Chromebook, the mark scheme <b>opens beside your answers</b> automatically.",
        "On a phone, press <b>Show the official mark scheme</b>.",
        "Press <b>Hide mark scheme</b> to close it, and <b>Open</b> (top of the panel) to see it in its own tab.",
    ]),
    p("Go through your answers one at a time and compare each with the mark scheme. Be honest with yourself: that is how you find out what to revise."),
    note("Mark schemes are available for recent AQA papers: <b>June 2022, June 2023, November 2021 and November 2022</b>. For other years, including 2024, the exam board has not published the mark scheme where Educate can show it, and the page tells you so. Ask your teacher for those."),
    p("AI marking", "h2"),
    p("If the paper has a mark scheme, the AI can mark your answers for you."),
    steps([
        "Finish the paper so you can see your answers.",
        "Press <b>Mark my answers with AI</b>.",
        "Wait. It usually takes less than a minute.",
        "At the top you see your <b>total</b>, for example \"46 / 84 marks\", and a short comment about the whole paper.",
        "Under each answer you see <b>AI mark</b>, such as \"2 / 3\", and one or two sentences saying what earned marks and what was missing.",
    ]),
    box("Colours:", "A <font color='#10b981'><b>green</b></font> box means full marks, <font color='#d97706'><b>amber</b></font> means some marks, and <font color='#e11d48'><b>red</b></font> means no marks for that question."),
    note("<b>The AI can make mistakes.</b> It is a helper, not an examiner. Check its marks against the mark scheme, and ask your teacher if something does not look right."),
    p("What the AI does and does not mark:"),
    bullets([
        "It marks typed answers and multiple-choice answers.",
        "It does <b>not</b> mark drawings. Check those yourself against the mark scheme.",
        "Questions you left blank count as 0.",
        "It marks what you wrote. If a question needs working on paper or a diagram, it can only mark what you typed.",
    ]),
    tip("You can use AI marking a few times in a row. If you use it a lot in a short time, Educate asks you to wait a few minutes."),
]

# 7 ───────────────────────────────────────────────────────────────────────────
story += [
    section("Free practice (including 11+)"),
    p("Free practice gives you ten questions taken from real papers, with no timer. Use it for a quick session. You need to be signed in."),
    steps([
        "Press <b>Practice</b> in the menu.",
        "Type a <b>Subject</b>, for example Mathematics or Biology. Suggestions appear as you type.",
        "If you like, choose an <b>Exam Type</b> (GCSE or A-Level) and type a <b>Topic</b>.",
        "Press <b>Start Practice</b>.",
        "Work through the questions. Press <b>Mark as done</b> on each one you finish.",
        "Finish to save how many you did.",
    ]),
    p("11+ practice", "h2"),
    p("Choose <b>11+</b> as the Exam Type. You do not need to type a subject. Then press <b>Start Practice</b>."),
    note("11+ is new on Educate. Some 11+ questions are missing the picture or passage they go with, so a few will not make sense on their own. Skip those and move on."),
]

# 8 ───────────────────────────────────────────────────────────────────────────
story += [
    section("Other things you can do"),
    p("These are in the menu. Most need you to be signed in."),
    bullets([
        "<b>AI Tutor:</b> press <b>AI Tutor</b> and type a question, such as \"Explain how to factorise a quadratic\". Ask it to explain again in a different way if you don't follow.",
        "<b>Revision Notes:</b> short notes on a topic to read before a quiz.",
        "<b>My Flashcards:</b> press <b>New Deck</b> to make your own cards and test yourself.",
        "<b>Timetable:</b> plan your revision. <b>Auto-Generate Revision Plan</b> makes a plan for you.",
        "<b>Exams:</b> press <b>Add Exam</b> to put in your exam dates and see a countdown.",
        "<b>Timer:</b> a study timer to help you focus.",
        "<b>Checklist</b> and <b>Mastery:</b> see which topics you have covered.",
        "<b>Diagnosis:</b> a short test that suggests topics to work on.",
        "<b>Progress</b> and <b>Achievements:</b> your quiz history, points and badges.",
        "<b>Games:</b> revision games, some of which you can play against a friend online.",
        "<b>Profile:</b> change your name or subjects. You can also <b>share with a parent</b>: this makes a read-only link so a parent can see your progress without an account.",
    ]),
    note("Online games and the leaderboard need you to be signed in."),
]

# 9 ───────────────────────────────────────────────────────────────────────────
story += [
    section("Phones, tablets and Chromebooks"),
    p("Educate works on small screens, but past papers are easier on a bigger one."),
    bullets([
        "Use a laptop, Chromebook or tablet for past papers if you can.",
        "On a phone, <b>turn it sideways</b> for more room.",
        "On a phone, the original paper and the mark scheme are shown as <b>page pictures</b> that you scroll through. Pinch to zoom in.",
        "The side panel covers most of a phone screen. Press the <b>X</b> at the top of the panel, or tap outside it, to close it and get back to your answers.",
        "The menu is at the bottom of the screen on a phone.",
    ]),
    tip("Doing a full paper? Charge your device first and use Wi-Fi. A paper can take over an hour."),
]

# 10 ──────────────────────────────────────────────────────────────────────────
story += [
    section("Staying safe and playing fair"),
    bullets([
        "<b>Keep your password to yourself.</b> Don't share it with friends.",
        "<b>Sign out</b> when you finish on a shared or school computer.",
        "<b>Don't type private things</b> into the AI Tutor, like your address or phone number.",
        "<b>The AI can be wrong.</b> If the AI Tutor or AI marking says something that doesn't match your notes or the mark scheme, trust the mark scheme and ask your teacher.",
        "<b>Use Educate to learn, not to copy.</b> Try each question yourself before you look at the mark scheme. Looking first feels quicker but you learn far less.",
        "<b>Be kind</b> in games. The name you choose is seen by other players.",
    ]),
]

# 11 ──────────────────────────────────────────────────────────────────────────
FAQ = [
    ("The paper I want has no green dot.",
     "That paper is not on Educate yet. Use <b>Download Paper</b> to get it from the exam board and do it on paper, or pick a year with a green dot."),
    ("I picked a year, but the page says a different paper will open.",
     "Educate does not have that exact paper. <b>Practise a different paper instead</b> gives you another real paper for the same subject. The year shown on the download buttons will not match it."),
    ("There is no mark scheme for my paper.",
     "The exam board has not published it where Educate can show it. This is normal for 2024 papers and for papers before 2022. Ask your teacher, or look on the exam board's website."),
    ("There is no \"Mark my answers with AI\" button.",
     "The button only appears when the paper has a mark scheme and you have typed at least one answer. Papers without a mark scheme cannot be AI-marked."),
    ("AI marking says I have used it a lot and must wait.",
     "This is a limit to keep things fair for everyone. Wait about 15 minutes and try again."),
    ("I think the AI marked me wrong.",
     "It might have. Look at that question in the mark scheme. If you still think you deserve the mark, show your teacher."),
    ("I see an \"Open\" button instead of the paper.",
     "Your browser is set to download PDF files instead of showing them. Educate should show page pictures instead. If it doesn't, press <b>Open</b>, or in Chrome go to <b>chrome://settings/content/pdfDocuments</b> and choose <b>Open PDFs in Chrome</b>."),
    ("I lost my answers.",
     "Answers are saved in the browser tab you were using. If you closed that tab, or changed to another device, they are gone. If you only refreshed the page, press <b>Start Paper</b> and they come back."),
    ("It asks me for a code when I sign in.",
     "That is normal on a new device. Check your email for a 6-digit code. If it has not arrived after a minute, look in your junk folder or ask for the code again."),
    ("A question doesn't make sense, or mentions a diagram I can't see.",
     "Press <b>PDF Figures</b> to see the original page. The on-screen text is copied from the paper by a computer and is sometimes untidy."),
    ("A question shows multiple-choice buttons but it isn't multiple choice.",
     "Press <b>Not a multiple-choice question? Type your answer instead</b> underneath it."),
    ("Free practice says \"No questions found\".",
     "Check the spelling of the subject. Use the full name, such as \"Mathematics\" rather than \"Maths\", and try removing the topic."),
    ("I can't play online games or see the leaderboard.",
     "You need to sign in first."),
    ("The page says something went wrong.",
     "Refresh the page and try again. If it keeps happening, tell your teacher or parent which page you were on and what you pressed."),
]

story += [section("Help! Something isn't working"), p("Find your problem below.")]
for q, a in FAQ:
    story.append(KeepTogether([p(q, "q"), p(a)]))

story += [
    Spacer(1, 10),
    box("Still stuck?", "Tell your teacher, parent or carer. It helps if you can say which page you were on, what you pressed, and what the screen said."),
]


def build():
    doc = BaseDocTemplate(
        str(OUT), pagesize=A4, leftMargin=22 * mm, rightMargin=22 * mm, topMargin=20 * mm, bottomMargin=20 * mm,
        title="Educate help guide", author="Educate", subject="Help guide for students and parents",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates([PageTemplate(id="page", frames=[frame], onPage=footer)])
    doc.build(story)
    print(f"Wrote {OUT.name}")


if __name__ == "__main__":
    build()
