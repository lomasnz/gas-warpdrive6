function myFunction() {
  var input = {
    instruction1 : "instruction1",
    instruction2 : "instruction2",
    instruction3 : "instruction1",
    modelSize : 8096
  }
  var text ="here\nis some text\nlksjhdlshjfdkshfd lashjdsajhd khjdkshdk dljadlkjsadja\nwlkjdwlkdjklwjeklew";
  var chunks = text.split("\n");
  var res = OpenAIService._responseSize(input, chunks);
  console.log(res);

}
