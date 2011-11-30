<?php

class Converty {
  public static function factory($codec, $value)
  {
    $class = 'Codec_' . ucfirst($codec);
    return new $class($value);
  }
}

abstract class Codec
{
  protected $_value;
  
  public function __construct($value)
  {
    $this->_value = $value;
  }
}

class Codec_Gzip extends Codec
{
  public function encode()
  {
    return gzcompress($this->_value);
  }
  
  public function decode()
  {
    return gzdeflate($this->_value);
  }
}

$codec = Converty::factory($_GET['codec'], $_GET['value']);
$method = $_GET['method'];
switch ($method) {
  case 'encode':
  case 'decode':
    echo $codec->$method();
}