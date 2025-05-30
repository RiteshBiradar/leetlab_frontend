export const getStarterCode = (language) => {
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
