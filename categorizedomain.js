static void Main() {
    string[] words = { "better", "good", "excellent", "poor", "talent","experience" };
    string[] categories = { "positive", "negative", "null" };

    using(WebClient client = new WebClient()){
        foreach(string word in words) {
            var bestCategory = categories.OrderByDescending(
                word => Rank(client, word)).First();
            Console.WriteLine("{0}: {1}", bestCategory, word);
        }
    }
}

static int Rank(WebClient client, string word, string category) {
    string s = client.DownloadString("http://www.google.com/search?q=%2B" +
        Uri.EscapeDataString(word) + "+%2B" +
        Uri.EscapeDataString(category));
    var match = Regex.Match(s, @"of about \<b\>([0-9,]+)\</b\>");
    int rank = match.Success ? int.Parse(match.Groups[1].Value, NumberStyles.Any) : 0;
    Debug.WriteLine(string.Format("\t{0} / {1} : {2}", word, category, rank));
    return rank;
}