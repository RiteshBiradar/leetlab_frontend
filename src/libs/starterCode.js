export const getStarterCode = (language, problemTitle = "") => {
  if (problemTitle === "add-two-numbers") {
    const addTwoNumbersStarter = {
      Java: `import java.util.*;
      public class Main {
        public static void main(String[] args) {
          // your code goes here
          Scanner sc = new Scanner(System.in);
          int a = sc.nextInt();
          int b = sc.nextInt();
          System.out.println(a + b);
    }
}`,
      JavaScript: `// Add Two Numbers problem
        function main() {
        const a = parseInt(prompt("Enter first number:"));
        const b = parseInt(prompt("Enter second number:"));
        console.log(a + b);
}
main();`,
      Python: `# Add Two Numbers problem
  def main():
    a = int(input())
    b = int(input())
    print(a + b)

if __name__ == "__main__":
    main()`
    };
    return addTwoNumbersStarter[language] || "";
  }

  const starterCodes = {
    Java: `public class Main {
  public static void main(String[] args) {
    // your code goes here
  }
}`,
    JavaScript: `function main() {
  // your code goes here
}
main();`,
    Python: `def main():
    # your code goes here
    pass

if __name__ == "__main__":
    main()`,
  };

  return starterCodes[language] || "";
};
