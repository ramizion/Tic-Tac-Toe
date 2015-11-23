<html>
<head>
<?php
//מערך שמכיל את התמונות
$gallery_items = Array('images/image1.jpg',
'images/image2.jpg', 'images/image3.jpg',
'images/image4.jpg', 'images/image5.jpg',
'images/image6.jpg','images/image7.jpg',
'images/image8.jpg', 'images/image9.jpg');
//ספירה של מספר הפריטים במערך
$number_items = count($gallery_items);
?>
</head>
<body>
<?php
//אנחנו קובעים שמספר הפריטים בשורה של הטבלה יהיה ארבע
$number_items_per_row = 4;
//חישוב מספר השורות
$number_of_rows = ceil($number_items / $number_items_per_row);
?>
<table>
<?php
  //מייצרים את מספר השורות הרצוי לנו בטבלה
  for($k=0; $k < $number_of_rows; $k++){
?>
<tr>
<?php
  //מייצרים את מספר השורות הרצוי לנו בכל שורה של הטבלה
  for($i=0; $i < $number_items_per_row; $i++){
?>
<td>
<?php
//התנהגות שונה לשורה הראשונה לעומת השורות הבאות בתור
//בשורה הראשונה
if($k==0){
  $m = $i;
}
//משורה 2 והילך החישוב שונה
elseif($k>0){
  $m = ($k*$number_items_per_row) + $i;
}
//נציג רק פריטים קיימים
if($m < $number_items){
  echo '<img src='.'"'.$gallery_items[$m].'"'.'width="100" height="100" />';
}
?>
</td>
<?php } ?>
</tr>
<?php } ?>
</table>
</body>
</html>