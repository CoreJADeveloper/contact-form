<?php
if ($field_object->required) {
    $required = 'required';
} else {
    $required = '';
}
if (!$field_object->hide_label && $field_object->required) {
    ?>
    <div>
        <label><?php echo esc_html($field_object->label) ?> <span class='required-field-class'>*</span></label>
    </div>
    <?php
} else if (!$field_object->hide_label && !$field_object->required) {
    ?>
    <div>
        <label><?php echo esc_html($field_object->label) ?></label>
    </div>
    <?php
} else {
    $field_html_label = '';
}

$field_html_input = '';

?>
    <div class='<?php echo $field_object->built_classes ?>'>
        <?php

        if ($field_object->hide_label && $field_object->required) {
            ?>
            <div>
                <span class='required-field-class'>*</span>
            </div>
            <?php
        }

        foreach ($field_object->choices as $key => $choice) {
            if ($choice->checked) {
                $checked = 'checked';
            } else {
                $checked = '';
            }
            ?>
            <div>
                <label>
                    <input type='checkbox'
                           class='<?php echo esc_attr($field_object->classes) ?>'
                        <?php echo $checked ?>
                           value='<?php echo esc_html($choice->text) ?>'
                        <?php echo $required ?> name='ng-field[ng-field-<?php echo $array_key ?>]'/>
                    <?php echo esc_html($choice->text) ?>
                </label>
            </div>
            <?php
        }

        ?>
        <span><?php echo esc_html($field_object->description) ?></span>
    </div>
<?php

if ($required == 'required') {
    $checkbox_required = "
        var checkbox_elements = document.getElementsByName('ng-field[ng-field-" . $array_key . "]');

        for (let el of checkbox_elements) {
          if (el.checked === true) {
            remove_required_attribute(checkbox_elements);
            break;
          }

          el.addEventListener( 'change', function() {
            if(this.checked) {
                remove_required_attribute(checkbox_elements);
            } else {
                check_required_attribute_checked(checkbox_elements);
            }
          });
        }

        function check_required_attribute_checked(checkbox_elements){
          for (let el of checkbox_elements) {
            if (el.checked === true) {
                remove_required_attribute(checkbox_elements);
                break;
            } else{
                add_required_attribute(checkbox_elements);
            }
          }
        }

        function remove_required_attribute(checkbox_elements){
            for (let el of checkbox_elements) {
              el.required = false;
            }
        }

        function add_required_attribute(checkbox_elements){
            for (let el of checkbox_elements) {
              el.required = true;
            }
        }
        ";
    wp_add_inline_script('angcf-inline-script', $checkbox_required);
}