const editor = document.getElementById("editor");
const output = document.getElementById("output");
const consoleLog = document.getElementById("console");
const suggestionBox = document.getElementById("suggestionBox");

const suggestions = [
  "function.(name()) do {\n  \n}.true",
  "if () do {\n  \n}",
  "while () do {\n  \n}",
  "module.(name) do {\n  \n}.true",
  "print(\"\")",
  "number age = 10",
  "userinput.Username",
  "userinput.Password",
  "input = input: true",
  "Players = Players: true",
  "Error(\"Missing block. Did you mean {\n  \n} ?\")",
  "<{ }>"
];

function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`.tab[onclick*="${tabName}"]`).classList.add('active');
  editor.value = 'print("Hello world!")\n';
  output.textContent = '';
  consoleLog.textContent = '';

  editor.classList.add("slide-left");
  setTimeout(() => editor.classList.remove("slide-left"), 400);
}

document.getElementById("runBtn").addEventListener("click", () => {
  const code = editor.value;
  consoleLog.textContent = "";

  output.classList.add("slide-up");
  consoleLog.classList.add("slide-down");

  setTimeout(() => {
    output.classList.remove("slide-up");
    consoleLog.classList.remove("slide-down");
  }, 400);

  if (code.includes("print(")) {
    const match = code.match(/print\("(.+?)"\)/);
    if (match) {
      output.textContent = match[1];
      consoleLog.textContent = `Log: ${match[1]}`;
    } else {
      output.textContent = 'Error("Syntax error in print statement")';
      consoleLog.textContent = 'Error("Syntax error in print statement")';
    }
  } else {
    output.textContent = 'Error("No output generated")';
    consoleLog.textContent = 'Error("No output generated")';
  }
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const code = editor.value;
  const blob = new Blob([code], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "lucidcoder_project.txt";
  link.click();
});

editor.addEventListener("input", () => {
  const text = editor.value;
  const lastWord = text.split(/\s+/).pop();
  const matches = suggestions.filter(s => s.startsWith(lastWord));

  if (matches.length > 0 && lastWord.length > 0) {
    suggestionBox.innerHTML = "";
    matches.forEach(match => {
      const item = document.createElement("div");
      item.textContent = match;
      item.style.cursor = "pointer";
      item.style.padding = "4px";
      item.addEventListener("click", () => {
        editor.value = text.replace(new RegExp(lastWord + "$"), match);
        suggestionBox.style.display = "none";
        editor.focus();
      });
      suggestionBox.appendChild(item);
    });

    const rect = editor.getBoundingClientRect();
    suggestionBox.style.left = rect.left + "px";
    suggestionBox.style.top = (rect.bottom + 5) + "px";
    suggestionBox.classList.add("slide-up");
    suggestionBox.style.display = "block";

    setTimeout(() => {
      suggestionBox.classList.remove("slide-up");
    }, 400);
  } else {
    suggestionBox.style.display = "none";
  }
});