<?php
$dir = "models/";
$files = array_diff(scandir($dir), array('..', '.'));
echo json_encode($files);
?>