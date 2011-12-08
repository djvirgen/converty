<?php

class Converty {
  public function __construct($value)
  {
    $this->_value = $value;
  }
  
  public function __toString()
  {
    return $this->_value;
  }
  
  public function urlEncode()
  {
    $this->_value = urlencode($this->_value);
  }
  
  public function urlDecode()
  {
    $this->_value = urldecode($this->_value);
  }
  
  public function htmlEncode()
  {
    $this->_value = htmlentities($this->_value, ENT_QUOTES, 'utf-8');
  }
  
  public function htmlDecode()
  {
    $this->_value = html_entity_decode($this->_value);
  }
  
  public function addSlashes()
  {
    $this->_value = addslashes($this->_value);
  }
  
  public function stripSlashes()
  {
    $this->_value = stripslashes($this->_value);
  }
  
  public function gzipEncode()
  {
    $this->_value = gzcompress($this->_value);
  }
  
  public function gzipDecode()
  {
    $this->_value =  gzdeflate($this->_value);
  }
  
  public function markdown()
  {
    require_once dirname(__FILE__) . '/library/Markdown/markdown.php';
    $this->_value =  Markdown($this->_value);
  }
}

$converty = new Converty($_GET['value']);
$converterChain = $_GET['converterChain'];
foreach ($converterChain as $method) {
  $converty->$method();
}
echo $converty;