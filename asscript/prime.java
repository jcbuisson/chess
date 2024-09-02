public class prime {

   public static  boolean isPrime(int n) {
      for (int i = 2; i < n; i++) {
         if (n % i == 0) {
            return false;
         }
      }
      return true;
   }

   public static int getPrime(int n) {
      int count = 0;
      int num = 2;
      while (n > count) {
         if (isPrime(num)) {
            count += 1;
         }
         num += 1;
      }
      return num - 1;
   }

   public static void main(String[] args) {
      System.out.println(getPrime(10001));
   }

}

