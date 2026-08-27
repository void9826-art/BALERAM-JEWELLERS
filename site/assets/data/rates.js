/* ============================================================
   TODAY'S RATES — this is the only file the shop needs to edit.
   ============================================================

   HOW TO UPDATE
   1. Change the numbers below to today's rate.
   2. Change "updated" to today's date, written as YYYY-MM-DD.
   3. Save the file. That is all. The website updates itself.

   Leave a number as null and that card simply does not appear,
   and the page invites people to message for the rate instead.
   That is the safe setting: an empty card is better than a wrong price.

   Numbers are Nepali rupees. Write them plainly, with no commas
   and no "Rs". Write 185400, never "Rs 1,85,400".
   ============================================================ */

window.RATES = {

  // The date these numbers were set. Format: YYYY-MM-DD
  updated: null,

  metals: [
    {
      metal: "Gold",
      fineness: "22 carat · 916 hallmark",
      perTola: null,      // <- price of one tola  (11.664 grams)
      per10g:  null       // <- price of ten grams
    },
    {
      metal: "Gold",
      fineness: "24 carat · 999 fine",
      perTola: null,
      per10g:  null
    },
    {
      metal: "Silver",
      fineness: "925 sterling",
      perTola: null,
      per10g:  null
    }
  ]
};
