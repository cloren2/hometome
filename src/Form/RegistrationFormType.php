<?php

namespace App\Form;

use App\Entity\User;
use App\Entity\Ciudad;
use App\Entity\Preferencias;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\RangeType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username')
            ->add('nombre')
            ->add('Apellidos')
            ->add('foto', FileType::class,[
                'label'=> "Imagen:",
                'attr'=> ['class'=> 'fileImg'],
                'data_class' => null,
                'mapped'=>false,
                'required' =>false
            ])
            ->add('fechaNac',DateType::class, array(
                'widget' => 'choice',
                'years' => range(date('Y'), date('Y')-100),
                'label' => 'Fecha de nacimiento'
              ))
            ->add('ciudad', EntityType::class, [
                'class' => Ciudad::class,
                'choice_label' => 'nombre'
               
            ])
            ->add('genero', ChoiceType::class, array(
                'choices' => array(
                    'Hombre' =>'H',
                    'Mujer'=>'M',
                    'No importa'=>'N'
                )
            ))
            ->add('numRoomMates', ChoiceType::class, array(
                'choices' => array(
                    '1' =>'1',
                    '2'=>'2',
                    '3 o más'=>'3+'
                ),
                'label' => 'Número de compañeros/as de piso'
            ))
            ->add('precioMin' , null, [
                'label' => 'Precio mínimo'  
            ])
            ->add('precioMax' , null, [
                'label' => 'Precio máximo'
            ])
            ->add('preferencias', EntityType::class, [
                'class' => Preferencias::class,
                'choice_label' => 'nombre',
                'multiple' => true,
                'expanded' => true
            
            ])
            ->add('descripcion', TextareaType::class, [
                'attr' => [
                        'placeholder' => '¡Cuéntanos algo sobre ti!'],
                'required'=> false
                
            ])
            ->add('plainPassword', PasswordType::class, [
                // instead of being set onto the object directly,
                // this is read and encoded in the controller
                'label' => 'Contraseña',
                'mapped' => false,
                'required'=>false,
                'attr'=> array('class'=>'pass'),
                'constraints' => [
                   
                    new Length([
                        'min' => 4,
                        'minMessage' => 'La contraseña debe incluir al menos 4 caracteres',
                        // max length allowed by Symfony for security reasons
                        'max' => 255,
                    ]),
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
